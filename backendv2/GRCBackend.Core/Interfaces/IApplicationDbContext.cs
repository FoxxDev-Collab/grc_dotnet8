using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GRCBackend.Core.Entities;

namespace GRCBackend.Core.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Organization> Organizations { get; set; }
        DbSet<RiskProfile> RiskProfiles { get; set; }
        DbSet<SystemUser> SystemUsers { get; set; }
        DbSet<ClientUser> ClientUsers { get; set; }
        DbSet<AuditLog> AuditLogs { get; set; }
        DbSet<InformationSystem> Systems { get; set; }
        DbSet<RiskMatrixEntry> RiskMatrixEntries { get; set; }
        DbSet<MitigationPriority> MitigationPriorities { get; set; }
        DbSet<QuantitativeRisk> QuantitativeRisks { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
