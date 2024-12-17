using System;
using System.Collections.Generic;
using GRCBackend.Core.Interfaces;

namespace GRCBackend.Core.Entities
{
    public class SystemUser : BaseEntity, IAuthenticatable
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public string RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // Organization relationship
        public Guid? OrganizationId { get; set; }
        public virtual Organization Organization { get; set; }
    }
}
