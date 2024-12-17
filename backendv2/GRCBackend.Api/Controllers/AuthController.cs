using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using GRCBackend.Application.DTOs;
using GRCBackend.Core.Interfaces;
using GRCBackend.Application.Mapping;
using Microsoft.AspNetCore.Cors;
using System.Security.Claims;
using GRCBackend.Core.Models;

namespace GRCBackend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authService;
        private readonly ISystemUserRepository _systemUserRepository;
        private readonly IClientUserRepository _clientUserRepository;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthenticationService authService,
            ISystemUserRepository systemUserRepository,
            IClientUserRepository clientUserRepository,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _systemUserRepository = systemUserRepository;
            _clientUserRepository = clientUserRepository;
            _logger = logger;
        }

        [HttpPost("system/login")]
        public async Task<ActionResult<AuthenticationResponseDTO>> SystemLogin([FromBody] LoginRequestDTO request)
        {
            _logger.LogInformation("System login attempt for email: {Email}", request.Email);
            
            var result = await _authService.AuthenticateSystemUserAsync(request.Email, request.Password);
            
            if (!result.Success)
            {
                _logger.LogWarning("System login failed for email: {Email}. Errors: {Errors}", 
                    request.Email, string.Join(", ", result.Errors ?? Array.Empty<string>()));
                return Unauthorized(new { Errors = result.Errors });
            }

            _logger.LogInformation("System login successful for email: {Email}", request.Email);

            // Ensure CORS headers are properly set
            Response.Headers["Access-Control-Allow-Credentials"] = "true";
            Response.Headers["Access-Control-Expose-Headers"] = "Authorization";

            var response = AuthenticationMappings.ToDto(result);
            return Ok(response);
        }

        [HttpPost("client/login")]
        public async Task<ActionResult<AuthenticationResponseDTO>> ClientLogin([FromBody] LoginRequestDTO request)
        {
            _logger.LogInformation("Client login attempt for email: {Email}", request.Email);
            
            var result = await _authService.AuthenticateClientUserAsync(request.Email, request.Password);
            
            if (!result.Success)
            {
                _logger.LogWarning("Client login failed for email: {Email}. Errors: {Errors}", 
                    request.Email, string.Join(", ", result.Errors ?? Array.Empty<string>()));
                return Unauthorized(new { Errors = result.Errors });
            }

            _logger.LogInformation("Client login successful for email: {Email}", request.Email);

            // Ensure CORS headers are properly set
            Response.Headers["Access-Control-Allow-Credentials"] = "true";
            Response.Headers["Access-Control-Expose-Headers"] = "Authorization";

            var response = AuthenticationMappings.ToDto(result);
            return Ok(response);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> GetProfile()
        {
            var userType = User.FindFirst("user_type")?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            _logger.LogInformation("GetProfile called for user type: {UserType}, ID: {UserId}", userType, userId);

            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("User ID not found in token claims");
                return BadRequest(new { Error = "User ID not found in token" });
            }

            if (!System.Guid.TryParse(userId, out var userGuid))
            {
                _logger.LogWarning("Invalid user ID format: {UserId}", userId);
                return BadRequest(new { Error = "Invalid user ID format" });
            }

            if (userType == "system")
            {
                var systemUser = await _systemUserRepository.GetByIdAsync(userGuid);
                if (systemUser == null)
                {
                    _logger.LogWarning("System user not found for ID: {UserId}", userId);
                    return NotFound(new { Error = "System user not found" });
                }

                var systemUserModel = AuthenticationMappings.ToModel(systemUser);
                if (systemUserModel == null)
                {
                    _logger.LogError("Failed to map system user model for ID: {UserId}", userId);
                    return StatusCode(500, new { Error = "Failed to map user data" });
                }

                var result = new AuthenticationResult 
                { 
                    Success = true,
                    SystemUser = systemUserModel,
                    Errors = Array.Empty<string>()
                };

                _logger.LogInformation("Successfully retrieved system user profile for ID: {UserId}", userId);
                return Ok(AuthenticationMappings.ToDto(result).User);
            }
            else if (userType == "client")
            {
                var clientUser = await _clientUserRepository.GetByIdAsync(userGuid);
                if (clientUser == null)
                {
                    _logger.LogWarning("Client user not found for ID: {UserId}", userId);
                    return NotFound(new { Error = "Client user not found" });
                }

                var clientUserModel = AuthenticationMappings.ToModel(clientUser);
                if (clientUserModel == null)
                {
                    _logger.LogError("Failed to map client user model for ID: {UserId}", userId);
                    return StatusCode(500, new { Error = "Failed to map user data" });
                }

                var result = new AuthenticationResult 
                { 
                    Success = true,
                    ClientUser = clientUserModel,
                    Errors = Array.Empty<string>()
                };

                _logger.LogInformation("Successfully retrieved client user profile for ID: {UserId}", userId);
                return Ok(AuthenticationMappings.ToDto(result).User);
            }

            _logger.LogWarning("Invalid user type: {UserType}", userType);
            return BadRequest(new { Error = "Invalid user type" });
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthenticationResponseDTO>> RefreshToken([FromBody] RefreshTokenRequestDTO request)
        {
            _logger.LogInformation("Token refresh attempt");
            
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            
            if (!result.Success)
            {
                _logger.LogWarning("Token refresh failed. Errors: {Errors}", 
                    string.Join(", ", result.Errors ?? Array.Empty<string>()));
                return Unauthorized(new { Errors = result.Errors });
            }

            _logger.LogInformation("Token refresh successful");

            var response = AuthenticationMappings.ToDto(result);
            return Ok(response);
        }

        [HttpPost("revoke-token")]
        [Authorize]
        public async Task<IActionResult> RevokeToken([FromBody] RefreshTokenRequestDTO request)
        {
            _logger.LogInformation("Token revocation attempt");
            
            var result = await _authService.RevokeTokenAsync(request.RefreshToken);
            
            if (!result)
            {
                _logger.LogWarning("Token revocation failed");
                return BadRequest(new { Error = "Invalid token" });
            }

            _logger.LogInformation("Token revocation successful");
            return Ok(new { Message = "Token revoked successfully" });
        }

        [HttpGet("validate-token")]
        public async Task<IActionResult> ValidateToken([FromQuery] string token)
        {
            _logger.LogInformation("Token validation attempt");
            
            var isValid = await _authService.ValidateTokenAsync(token);
            
            _logger.LogInformation("Token validation result: {IsValid}", isValid);
            return Ok(new { IsValid = isValid });
        }

        [HttpOptions("{*path}")]
        public IActionResult HandleOptions()
        {
            _logger.LogInformation("Handling OPTIONS request for path: {Path}", HttpContext.Request.Path);
            return Ok();
        }
    }
}
