using System;
using System.ComponentModel.DataAnnotations;
using GRCBackend.Common.Enums;

namespace GRCBackend.Application.DTOs.Auth
{
    // For retrieving client user information
    public class ClientUserDTO
    {
        [JsonPropertyName("id")]
        public required string Id { get; set; }

        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("firstName")]
        public required string FirstName { get; set; }

        [JsonPropertyName("lastName")]
        public required string LastName { get; set; }

        [JsonPropertyName("organizationId")]
        public required string OrganizationId { get; set; }

        [JsonPropertyName("organizationRole")]
        public required string OrganizationRole { get; set; }

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }

        [JsonPropertyName("lastLogin")]
        public DateTime? LastLogin { get; set; }
    }

    // For creating a new client user
    public class CreateClientUserDTO
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

        [Required]
        public required string OrganizationId { get; set; }

        [Required]
        public required OrganizationRole OrganizationRole { get; set; }

        public string? PhoneNumber { get; set; }
    }

    // For updating an existing client user
    public class UpdateClientUserDTO
    {
        public required string Id { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public OrganizationRole? OrganizationRole { get; set; }
        public bool? IsActive { get; set; }
    }
}