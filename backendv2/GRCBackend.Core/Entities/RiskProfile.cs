using System;
using System.Collections.Generic;
using GRCBackend.Common.Enums;

namespace GRCBackend.Core.Entities
{
    public class RiskProfile : BaseEntity
    {
        public string BusinessFunctions { get; set; } = string.Empty;
        public string KeyAssets { get; set; } = string.Empty;
        public List<string> ComplianceFrameworks { get; set; } = new List<string>();
        public List<string> DataTypes { get; set; } = new List<string>();

        // Risk Levels
        public RiskLevel OperationalRisk { get; set; }
        public RiskLevel DataSecurityRisk { get; set; }
        public RiskLevel ComplianceRisk { get; set; }
        public RiskLevel FinancialRisk { get; set; }

        // Organization Relationship
        public Guid OrganizationId { get; set; }
        public virtual Organization Organization { get; set; }

        // Last Assessment
        public DateTime? LastAssessmentDate { get; set; }
        public string LastAssessmentBy { get; set; } = string.Empty;

        // Risk Mitigation
        public string MitigationPlans { get; set; } = string.Empty;
        public DateTime? NextReviewDate { get; set; }
    }
}
