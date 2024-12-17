using GRCBackend.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace GRCBackend.Infrastructure.Data.Configurations
{
    public class SystemUserConfiguration : IEntityTypeConfiguration<SystemUser>
    {
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public void Configure(EntityTypeBuilder<SystemUser> builder)
        {
            builder.ToTable("SystemUsers");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Email)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(e => e.PasswordHash)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(e => e.FirstName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(e => e.LastName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(e => e.RefreshToken)
                   .HasMaxLength(500)
                   .IsRequired(false);  // Make RefreshToken nullable

            // Configure JSON conversion for Roles
            builder.Property(e => e.Roles)
                   .HasConversion(
                       v => JsonSerializer.Serialize(v, _jsonOptions),
                       v => JsonSerializer.Deserialize<List<string>>(v, _jsonOptions) ?? new List<string>());

            builder.HasIndex(e => e.Email)
                   .IsUnique();

            // Configure Organization relationship
            builder.HasOne(e => e.Organization)
                   .WithMany(o => o.SystemUsers)
                   .HasForeignKey(e => e.OrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class ClientUserConfiguration : IEntityTypeConfiguration<ClientUser>
    {
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public void Configure(EntityTypeBuilder<ClientUser> builder)
        {
            builder.ToTable("ClientUsers");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Email)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(e => e.PasswordHash)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(e => e.FirstName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(e => e.LastName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(e => e.RefreshToken)
                   .HasMaxLength(500)
                   .IsRequired(false);  // Make RefreshToken nullable

            builder.Property(e => e.ClientRole)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(e => e.OrganizationRole)
                   .IsRequired()
                   .HasMaxLength(100);

            // Configure JSON conversion for OrganizationRoles
            builder.Property(e => e.OrganizationRoles)
                   .HasConversion(
                       v => JsonSerializer.Serialize(v, _jsonOptions),
                       v => JsonSerializer.Deserialize<List<string>>(v, _jsonOptions) ?? new List<string>());

            builder.HasIndex(e => e.Email)
                   .IsUnique();

            // Configure Organization relationship
            builder.HasOne(e => e.Organization)
                   .WithMany(o => o.ClientUsers)
                   .HasForeignKey(e => e.OrganizationId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
