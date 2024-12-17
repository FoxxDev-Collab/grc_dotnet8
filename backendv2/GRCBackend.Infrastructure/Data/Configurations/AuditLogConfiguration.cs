using GRCBackend.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GRCBackend.Infrastructure.Data.Configurations
{
    public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
    {
        public void Configure(EntityTypeBuilder<AuditLog> builder)
        {
            builder.ToTable("AuditLogs");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.EntityType)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(e => e.Action)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(e => e.Timestamp)
                   .IsRequired();

            // User relationships
            builder.HasOne(a => a.SystemUser)
                   .WithMany()
                   .HasForeignKey(a => a.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.ClientUser)
                   .WithMany()
                   .HasForeignKey(a => a.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Organization relationship
            builder.HasOne(a => a.Organization)
                   .WithMany(o => o.AuditLogs)
                   .HasForeignKey(a => a.OrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
