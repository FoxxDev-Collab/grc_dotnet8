using System;

namespace GRCBackend.Core.Interfaces
{
    public interface IAuthenticatable
    {
        string Email { get; set; }
        string PasswordHash { get; set; }
        string RefreshToken { get; set; }
        DateTime? RefreshTokenExpiryTime { get; set; }
        DateTime? LastLoginDate { get; set; }
        bool IsActive { get; set; }
    }
}
