using Microsoft.EntityFrameworkCore;
using GRCBackend.Core.Entities;
using GRCBackend.Core.Interfaces;
using GRCBackend.Infrastructure.Data.Configurations;

namespace GRCBackend.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Organization> Organizations { get; set; }
        public DbSet<RiskProfile> RiskProfiles { get; set; }
        public DbSet<SystemUser> SystemUsers { get; set; }
        public DbSet<ClientUser> ClientUsers { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<InformationSystem> Systems { get; set; }
        public DbSet<RiskMatrixEntry> RiskMatrixEntries { get; set; }
        public DbSet<MitigationPriority> MitigationPriorities { get; set; }
        public DbSet<QuantitativeRisk> QuantitativeRisks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply entity configurations
            modelBuilder.ApplyConfiguration(new OrganizationConfiguration());
            modelBuilder.ApplyConfiguration(new RiskProfileConfiguration());
            modelBuilder.ApplyConfiguration(new SystemUserConfiguration());
            modelBuilder.ApplyConfiguration(new ClientUserConfiguration());
            modelBuilder.ApplyConfiguration(new AuditLogConfiguration());
            modelBuilder.ApplyConfiguration(new InformationSystemConfiguration());
            modelBuilder.ApplyConfiguration(new MitigationPriorityConfiguration());
        }
    }
}
