using System;

namespace GRCBackend.Core.Entities
{
    public class RiskMatrixEntry : BaseEntity
    {
        public int Impact { get; set; }
        public int Likelihood { get; set; }
        public int Value { get; set; }

        // Organization relationship
        public Guid OrganizationId { get; set; }
        public virtual Organization Organization { get; set; }
    }
}
