using System;
using System.Collections.Generic;

namespace GRCBackend.Core.Entities
{
    public class InformationSystem : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        // System Classification
        public string SecurityCategorization { get; set; } = string.Empty;
        public string SystemType { get; set; } = string.Empty;
        public string AuthorizationBoundary { get; set; } = string.Empty;

        // System Details
        public string SystemOwner { get; set; } = string.Empty;
        public string SystemStatus { get; set; } = string.Empty;
        public DateTime? DeploymentDate { get; set; }
        public DateTime? LastAssessmentDate { get; set; }
        public DateTime? AuthorizationDate { get; set; }
        public DateTime? ContinuousMonitoringDate { get; set; }

        // Organization Relationship
        public Guid OrganizationId { get; set; }
        public virtual Organization Organization { get; set; }

        // Risk Management
        public virtual RiskProfile RiskProfile { get; set; }
        public virtual ICollection<QuantitativeRisk> QuantitativeRisks { get; set; } = new List<QuantitativeRisk>();
        public virtual ICollection<RiskMatrixEntry> RiskMatrix { get; set; } = new List<RiskMatrixEntry>();
        public virtual ICollection<MitigationPriority> MitigationPriorities { get; set; } = new List<MitigationPriority>();

        // Audit Trail
        public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

        // System Components and Dependencies
        public string Components { get; set; } = string.Empty;
        public string Dependencies { get; set; } = string.Empty;
        public string NetworkArchitecture { get; set; } = string.Empty;

        // System Security
        public string SecurityControls { get; set; } = string.Empty;
        public string IncidentResponsePlan { get; set; } = string.Empty;
        public string ContingencyPlan { get; set; } = string.Empty;
        public string ConfigurationManagement { get; set; } = string.Empty;
    }
}
