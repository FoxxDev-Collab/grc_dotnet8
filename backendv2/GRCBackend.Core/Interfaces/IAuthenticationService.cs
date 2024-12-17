using System.Threading.Tasks;
using GRCBackend.Core.Models;

namespace GRCBackend.Core.Interfaces
{
    public interface IAuthenticationService
    {
        Task<AuthenticationResult> AuthenticateSystemUserAsync(string email, string password);
        Task<AuthenticationResult> AuthenticateClientUserAsync(string email, string password);
        Task<AuthenticationResult> RefreshTokenAsync(string refreshToken);
        Task<bool> RevokeTokenAsync(string refreshToken);
        Task<string> GenerateEmailConfirmationTokenAsync(string email);
        Task<bool> ConfirmEmailAsync(string email, string token);
        Task<bool> ValidateTokenAsync(string token);
    }
}
