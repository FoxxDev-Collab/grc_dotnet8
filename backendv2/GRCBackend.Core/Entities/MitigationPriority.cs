using System;
using GRCBackend.Common.Enums;

namespace GRCBackend.Core.Entities
{
    public class MitigationPriority : BaseEntity
    {
        public string Risk { get; set; } = string.Empty;
        public int Priority { get; set; }
        public string Strategy { get; set; } = string.Empty;
        public string Timeline { get; set; } = string.Empty;
        public TimeFrame Timeframe { get; set; }
        public string RiskArea { get; set; } = string.Empty;
        public string SuccessCriteria { get; set; } = string.Empty;
        public string Resources { get; set; } = string.Empty;
        public string EstimatedCost { get; set; } = string.Empty;
        public string ResponsibleParty { get; set; } = string.Empty;

        // Organization relationship
        public Guid OrganizationId { get; set; }
        public virtual Organization Organization { get; set; }
    }
}
