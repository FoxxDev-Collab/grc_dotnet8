using GRCBackend.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GRCBackend.Infrastructure.Data.Configurations
{
    public class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
    {
        public void Configure(EntityTypeBuilder<Organization> builder)
        {
            builder.ToTable("Organizations");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Type)
                   .HasConversion<int>()
                   .IsRequired();

            builder.Property(e => e.Name)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(e => e.Description)
                   .HasMaxLength(1000);

            builder.Property(e => e.Email)
                   .HasMaxLength(200);

            builder.Property(e => e.Phone)
                   .HasMaxLength(50);

            builder.Property(e => e.Address)
                   .HasMaxLength(500);

            builder.Property(e => e.PrimaryContact)
                   .HasMaxLength(200);

            // Ensure only one Provider organization can exist
            builder.HasIndex(e => e.Type)
                   .HasFilter($"\"Type\" = {(int)GRCBackend.Common.Enums.OrganizationType.SERVICE_PROVIDER}")
                   .IsUnique();

            // Provider-Client relationships
            builder.HasMany(o => o.ClientOrganizations)
                   .WithOne(o => o.ProviderOrganization)
                   .HasForeignKey(o => o.ProviderOrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);

            // One-to-One relationship with RiskProfile
            builder.HasOne(o => o.RiskProfile)
                   .WithOne(rp => rp.Organization)
                   .HasForeignKey<RiskProfile>(rp => rp.OrganizationId)
                   .OnDelete(DeleteBehavior.Cascade);

            // User relationships - One-to-Many with SystemUsers
            builder.HasMany(o => o.SystemUsers)
                   .WithOne(su => su.Organization)
                   .HasForeignKey(su => su.OrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(o => o.ClientUsers)
                   .WithOne(cu => cu.Organization)
                   .HasForeignKey(cu => cu.OrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);

            // System Management
            builder.HasMany(o => o.Systems)
                   .WithOne(s => s.Organization)
                   .HasForeignKey(s => s.OrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Audit Trail
            builder.HasMany(o => o.AuditLogs)
                   .WithOne(a => a.Organization)
                   .HasForeignKey(a => a.OrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
