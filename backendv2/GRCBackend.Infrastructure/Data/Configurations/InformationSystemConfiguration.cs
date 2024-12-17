using GRCBackend.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GRCBackend.Infrastructure.Data.Configurations
{
    public class InformationSystemConfiguration : IEntityTypeConfiguration<InformationSystem>
    {
        public void Configure(EntityTypeBuilder<InformationSystem> builder)
        {
            builder.ToTable("InformationSystems");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Name)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(e => e.SecurityCategorization)
                   .HasMaxLength(100);

            builder.Property(e => e.SystemType)
                   .HasMaxLength(100);

            builder.Property(e => e.SystemOwner)
                   .HasMaxLength(200);

            // Organization relationship
            builder.HasOne(s => s.Organization)
                   .WithMany(o => o.Systems)
                   .HasForeignKey(s => s.OrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
