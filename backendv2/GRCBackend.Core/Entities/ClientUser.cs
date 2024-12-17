using System;
using System.Collections.Generic;
using GRCBackend.Core.Interfaces;

namespace GRCBackend.Core.Entities
{
    public class ClientUser : BaseEntity, IAuthenticatable
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public bool EmailConfirmed { get; set; }
        
        // Organization relationship
        public Guid OrganizationId { get; set; }
        public Organization? Organization { get; set; }
        
        // Roles
        public string ClientRole { get; set; } = string.Empty;
        public string OrganizationRole { get; set; } = string.Empty;
        public List<string> OrganizationRoles { get; set; } = new List<string>();
    }
}
