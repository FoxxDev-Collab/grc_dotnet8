using System;
using System.Text.Json.Serialization;
using GRCBackend.Core.Interfaces.DTOs;

namespace GRCBackend.Application.DTOs.Users
{
    public class ClientUserDto
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("firstName")]
        public string FirstName { get; set; } = string.Empty;

        [JsonPropertyName("lastName")]
        public string LastName { get; set; } = string.Empty;

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateClientUserDto
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("firstName")]
        public string FirstName { get; set; } = string.Empty;

        [JsonPropertyName("lastName")]
        public string LastName { get; set; } = string.Empty;
    }

    public class UpdateClientUserDto
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("firstName")]
        public string FirstName { get; set; } = string.Empty;

        [JsonPropertyName("lastName")]
        public string LastName { get; set; } = string.Empty;

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }
    }
}