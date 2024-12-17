using System;

namespace GRCBackend.Core.Entities
{
    public class QuantitativeRisk : BaseEntity
    {
        public decimal AnnualLoss { get; set; }
        public decimal ProbabilityOfOccurrence { get; set; }
        public int ImpactScore { get; set; }
        public decimal RiskScore { get; set; }

        // Organization relationship
        public Guid OrganizationId { get; set; }
        public virtual Organization Organization { get; set; }
    }
}
