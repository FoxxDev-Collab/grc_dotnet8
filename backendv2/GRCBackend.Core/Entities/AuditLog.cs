using System;
using System.Collections.Generic;

namespace GRCBackend.Core.Entities
{
    public class AuditLog : BaseEntity
    {
        public string EntityType { get; set; } = string.Empty;
        public Guid EntityId { get; set; }
        public string Action { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        // User who performed the action
        public Guid UserId { get; set; }
        public virtual SystemUser SystemUser { get; set; }
        public virtual ClientUser ClientUser { get; set; }
        
        // Organization context
        public Guid OrganizationId { get; set; }
        public virtual Organization Organization { get; set; }
        
        // Additional data stored as JSON
        public string AdditionalData { get; set; } = string.Empty;
        
        // IP Address and User Agent for security tracking
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        
        // Success/Failure tracking
        public bool IsSuccess { get; set; } = true;
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
