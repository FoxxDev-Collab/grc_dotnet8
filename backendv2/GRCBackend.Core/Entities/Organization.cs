using System;
using System.Collections.Generic;
using GRCBackend.Common.Enums;

namespace GRCBackend.Core.Entities
{
    public class Organization : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public OrganizationType Type { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool IsServiceProvider { get; set; }
        
        // Contact Information
        public string PrimaryContact { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        // Risk Management
        public virtual RiskProfile RiskProfile { get; set; }
        public virtual ICollection<QuantitativeRisk> QuantitativeRisks { get; set; } = new List<QuantitativeRisk>();
        public virtual ICollection<RiskMatrixEntry> RiskMatrix { get; set; } = new List<RiskMatrixEntry>();
        public virtual ICollection<MitigationPriority> MitigationPriorities { get; set; } = new List<MitigationPriority>();
        
        // User Management
        public virtual ICollection<SystemUser> SystemUsers { get; set; } = new List<SystemUser>();
        public virtual ICollection<ClientUser> ClientUsers { get; set; } = new List<ClientUser>();
        
        // System Management
        public virtual ICollection<InformationSystem> Systems { get; set; } = new List<InformationSystem>();
        
        // Audit Trail
        public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

        // Provider-Client Relationships
        public virtual ICollection<Organization> ClientOrganizations { get; set; } = new List<Organization>();
        public virtual Organization ProviderOrganization { get; set; }
        public Guid? ProviderOrganizationId { get; set; }

        // Helper Methods
        public bool IsProvider() => Type == OrganizationType.SERVICE_PROVIDER;
        public bool IsClient() => Type == OrganizationType.CLIENT;
    }
}
