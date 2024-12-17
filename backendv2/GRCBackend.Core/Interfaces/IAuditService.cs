using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GRCBackend.Core.Entities;

namespace GRCBackend.Core.Interfaces
{
    public interface IAuditService
    {
        Task LogAsync(
            string entityType,
            Guid entityId,
            string action,
            Guid userId,
            Dictionary<string, string>? additionalData = default);

        Task<IEnumerable<AuditLog>> GetAuditLogsForEntityAsync(
            string entityType,
            Guid entityId);

        Task<IEnumerable<AuditLog>> GetAuditLogsForOrganizationAsync(
            Guid organizationId,
            DateTime? startDate = null,
            DateTime? endDate = null);

        Task<IEnumerable<AuditLog>> GetAuditLogsForUserAsync(
            Guid userId,
            DateTime? startDate = null,
            DateTime? endDate = null);
    }
}
