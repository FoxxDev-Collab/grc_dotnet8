using GRCBackend.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GRCBackend.Infrastructure.Data.Configurations
{
    public class MitigationPriorityConfiguration : IEntityTypeConfiguration<MitigationPriority>
    {
        public void Configure(EntityTypeBuilder<MitigationPriority> builder)
        {
            builder.ToTable("MitigationPriorities");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Risk)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(e => e.Priority)
                   .HasConversion<int>();

            builder.Property(e => e.Strategy)
                   .IsRequired()
                   .HasMaxLength(1000);

            builder.Property(e => e.Timeline)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(e => e.Timeframe)
                   .HasConversion<int>()
                   .IsRequired();

            builder.Property(e => e.RiskArea)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(e => e.SuccessCriteria)
                   .IsRequired()
                   .HasMaxLength(1000);

            builder.Property(e => e.Resources)
                   .IsRequired()
                   .HasMaxLength(1000);

            builder.Property(e => e.EstimatedCost)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(e => e.ResponsibleParty)
                   .IsRequired()
                   .HasMaxLength(200);
        }
    }
}
