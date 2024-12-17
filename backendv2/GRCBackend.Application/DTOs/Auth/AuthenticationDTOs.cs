using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GRCBackend.Application.DTOs
{
    public class LoginRequestDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }

    public class RefreshTokenRequestDTO
    {
        [Required]
        public required string RefreshToken { get; set; }
    }

    public class AuthenticationResponseDTO
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("access_token")]
        public required string AccessToken { get; set; }

        [JsonPropertyName("refresh_token")]
        public required string RefreshToken { get; set; }

        [JsonPropertyName("errors")]
        public required string[] Errors { get; set; } = Array.Empty<string>();

        [JsonPropertyName("user")]
        public required UserDTO User { get; set; }
    }

    public class UserDTO
    {
        [JsonPropertyName("id")]
        public required string Id { get; set; }

        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("firstName")]
        public required string FirstName { get; set; }

        [JsonPropertyName("lastName")]
        public required string LastName { get; set; }

        [JsonPropertyName("role")]
        public required string Role { get; set; }

        [JsonPropertyName("organizationId")]
        public string? OrganizationId { get; set; } // Optional for SystemUsers

        [JsonPropertyName("type")]
        public required string Type { get; set; } // "system" or "client"

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }

        [JsonPropertyName("lastLogin")]
        public string? LastLogin { get; set; }
    }

    public class RegisterUserDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(8)]
        public required string Password { get; set; }

        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        public string? PhoneNumber { get; set; }
        
        // Optional for SystemUsers
        public string? OrganizationId { get; set; }
    }
}
