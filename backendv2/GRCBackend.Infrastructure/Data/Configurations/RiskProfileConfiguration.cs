using GRCBackend.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace GRCBackend.Infrastructure.Data.Configurations
{
    public class RiskProfileConfiguration : IEntityTypeConfiguration<RiskProfile>
    {
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public void Configure(EntityTypeBuilder<RiskProfile> builder)
        {
            builder.ToTable("RiskProfiles");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.BusinessFunctions)
                   .HasMaxLength(4000);

            builder.Property(e => e.KeyAssets)
                   .HasMaxLength(4000);

            // Store arrays as JSON
            builder.Property(e => e.ComplianceFrameworks)
                   .HasConversion(
                       v => JsonSerializer.Serialize(v, _jsonOptions),
                       v => JsonSerializer.Deserialize<List<string>>(v, _jsonOptions) ?? new List<string>());

            builder.Property(e => e.DataTypes)
                   .HasConversion(
                       v => JsonSerializer.Serialize(v, _jsonOptions),
                       v => JsonSerializer.Deserialize<List<string>>(v, _jsonOptions) ?? new List<string>());

            // Store RiskLevel enums as integers
            builder.Property(e => e.OperationalRisk)
                   .HasConversion<int>();

            builder.Property(e => e.DataSecurityRisk)
                   .HasConversion<int>();

            builder.Property(e => e.ComplianceRisk)
                   .HasConversion<int>();

            builder.Property(e => e.FinancialRisk)
                   .HasConversion<int>();

            builder.Property(e => e.LastAssessmentBy)
                   .HasMaxLength(200);
        }
    }
}
