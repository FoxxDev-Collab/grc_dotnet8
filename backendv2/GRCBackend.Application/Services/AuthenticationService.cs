using System;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using GRCBackend.Core.Interfaces;
using GRCBackend.Core.Entities;
using GRCBackend.Core.Models;
using GRCBackend.Application.Mapping;
using BC = BCrypt.Net.BCrypt;

namespace GRCBackend.Application.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly ISystemUserRepository _systemUserRepository;
        private readonly IClientUserRepository _clientUserRepository;
        private readonly IConfiguration _configuration;
        private readonly string _secretKey;

        public AuthenticationService(
            ISystemUserRepository systemUserRepository,
            IClientUserRepository clientUserRepository,
            IConfiguration configuration)
        {
            _systemUserRepository = systemUserRepository;
            _clientUserRepository = clientUserRepository;
            _configuration = configuration;
            _secretKey = _configuration["JwtSettings:SecretKey"] ?? 
                throw new InvalidOperationException("JWT SecretKey is not configured");
        }

        public async Task<AuthenticationResult> AuthenticateSystemUserAsync(string email, string password)
        {
            var user = await _systemUserRepository.GetByEmailAsync(email);
            if (user == null || !VerifyPassword(password, user.PasswordHash))
            {
                return new AuthenticationResult 
                { 
                    Success = false,
                    Errors = new[] { "Invalid email or password" }
                };
            }

            if (!user.IsActive)
            {
                return new AuthenticationResult 
                { 
                    Success = false,
                    Errors = new[] { "Account is deactivated" }
                };
            }

            var role = user.Roles.FirstOrDefault() ?? "USER";
            var (accessToken, refreshToken) = GenerateTokens(user, role);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            user.LastLoginDate = DateTime.UtcNow;
            await _systemUserRepository.UpdateAsync(user);

            var userModel = AuthenticationMappings.ToModel(user);
            if (userModel == null)
            {
                throw new InvalidOperationException("Failed to map user model");
            }

            return new AuthenticationResult
            {
                Success = true,
                Token = accessToken,
                RefreshToken = refreshToken,
                SystemUser = userModel
            };
        }

        public async Task<AuthenticationResult> AuthenticateClientUserAsync(string email, string password)
        {
            var user = await _clientUserRepository.GetByEmailAsync(email);
            if (user == null || !VerifyPassword(password, user.PasswordHash))
            {
                return new AuthenticationResult 
                { 
                    Success = false,
                    Errors = new[] { "Invalid email or password" }
                };
            }

            if (!user.IsActive)
            {
                return new AuthenticationResult 
                { 
                    Success = false,
                    Errors = new[] { "Account is deactivated" }
                };
            }

            var role = user.OrganizationRoles.FirstOrDefault() ?? "USER";
            var (accessToken, refreshToken) = GenerateTokens(user, role);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            user.LastLoginDate = DateTime.UtcNow;
            await _clientUserRepository.UpdateAsync(user);

            var userModel = AuthenticationMappings.ToModel(user);
            if (userModel == null)
            {
                throw new InvalidOperationException("Failed to map user model");
            }

            return new AuthenticationResult
            {
                Success = true,
                Token = accessToken,
                RefreshToken = refreshToken,
                ClientUser = userModel
            };
        }

        public async Task<AuthenticationResult> RefreshTokenAsync(string refreshToken)
        {
            var systemUser = await _systemUserRepository.GetByRefreshTokenAsync(refreshToken);
            if (systemUser != null)
            {
                var role = systemUser.Roles.FirstOrDefault() ?? "USER";
                return await RefreshUserTokenAsync(systemUser, role);
            }

            var clientUser = await _clientUserRepository.GetByRefreshTokenAsync(refreshToken);
            if (clientUser != null)
            {
                var role = clientUser.OrganizationRoles.FirstOrDefault() ?? "USER";
                return await RefreshUserTokenAsync(clientUser, role);
            }

            return new AuthenticationResult
            {
                Success = false,
                Errors = new[] { "Invalid refresh token" }
            };
        }

        public async Task<bool> RevokeTokenAsync(string refreshToken)
        {
            var systemUser = await _systemUserRepository.GetByRefreshTokenAsync(refreshToken);
            if (systemUser != null)
            {
                systemUser.RefreshToken = string.Empty;
                systemUser.RefreshTokenExpiryTime = null;
                return await _systemUserRepository.UpdateAsync(systemUser);
            }

            var clientUser = await _clientUserRepository.GetByRefreshTokenAsync(refreshToken);
            if (clientUser != null)
            {
                clientUser.RefreshToken = string.Empty;
                clientUser.RefreshTokenExpiryTime = null;
                return await _clientUserRepository.UpdateAsync(clientUser);
            }

            return false;
        }

        public async Task<string> GenerateEmailConfirmationTokenAsync(string email)
        {
            using var rng = RandomNumberGenerator.Create();
            var tokenBytes = new byte[32];
            await Task.Run(() => rng.GetBytes(tokenBytes));
            return Convert.ToBase64String(tokenBytes);
        }

        public async Task<bool> ConfirmEmailAsync(string email, string token)
        {
            var user = await _clientUserRepository.GetByEmailAsync(email);
            if (user != null)
            {
                user.EmailConfirmed = true;
                return await _clientUserRepository.UpdateAsync(user);
            }
            return false;
        }

        public Task<bool> ValidateTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token))
                return Task.FromResult(false);

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _configuration["JwtSettings:Issuer"],
                    ValidAudience = _configuration["JwtSettings:Audience"],
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return Task.FromResult(true);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        private (string accessToken, string refreshToken) GenerateTokens(IAuthenticatable user, string role)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            var baseEntity = user as BaseEntity;
            if (baseEntity == null)
                throw new InvalidOperationException("User must inherit from BaseEntity");

            var claims = new[]
            {
                new Claim("sub", baseEntity.Id.ToString()),
                new Claim("email", user.Email),
                new Claim("role", role),
                new Claim("type", user is SystemUser ? "system" : "client")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["JwtSettings:ExpirationHours"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var refreshToken = GenerateRefreshToken();

            return (tokenHandler.WriteToken(token), refreshToken);
        }

        private async Task<AuthenticationResult> RefreshUserTokenAsync(IAuthenticatable user, string role)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return new AuthenticationResult
                {
                    Success = false,
                    Errors = new[] { "Refresh token has expired" }
                };
            }

            var (accessToken, refreshToken) = GenerateTokens(user, role);

            var result = new AuthenticationResult
            {
                Success = true,
                Token = accessToken,
                RefreshToken = refreshToken,
                Errors = Array.Empty<string>()
            };

            if (user is SystemUser systemUser)
            {
                systemUser.RefreshToken = refreshToken;
                systemUser.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
                await _systemUserRepository.UpdateAsync(systemUser);

                var systemUserModel = AuthenticationMappings.ToModel(systemUser);
                if (systemUserModel == null)
                {
                    throw new InvalidOperationException("Failed to map system user model");
                }
                result.SystemUser = systemUserModel;
            }
            else if (user is ClientUser clientUser)
            {
                clientUser.RefreshToken = refreshToken;
                clientUser.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
                await _clientUserRepository.UpdateAsync(clientUser);

                var clientUserModel = AuthenticationMappings.ToModel(clientUser);
                if (clientUserModel == null)
                {
                    throw new InvalidOperationException("Failed to map client user model");
                }
                result.ClientUser = clientUserModel;
            }

            return result;
        }

        private string GenerateRefreshToken()
        {
            using var rng = RandomNumberGenerator.Create();
            var randomNumber = new byte[32];
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private bool VerifyPassword(string password, string hash)
        {
            return BC.Verify(password, hash);
        }
    }
}
