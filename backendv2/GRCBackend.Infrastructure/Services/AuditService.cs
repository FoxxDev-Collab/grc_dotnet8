using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using GRCBackend.Core.Interfaces;
using GRCBackend.Core.Entities;

namespace GRCBackend.Infrastructure.Services
{
    public class AuditService : IAuditService
    {
        private readonly IApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICurrentUserService _currentUserService;

        public AuditService(
            IApplicationDbContext context,
            IHttpContextAccessor httpContextAccessor,
            ICurrentUserService currentUserService)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _currentUserService = currentUserService;
        }

        public async Task LogAsync(
            string entityType,
            Guid entityId,
            string action,
            Guid userId,
            Dictionary<string, string>? additionalData = null)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var user = await _currentUserService.GetCurrentUserAsync();
            var organizationId = Guid.Empty;

            // Try to get organization ID based on user type
            if (user is SystemUser systemUser)
            {
                // For system users, try to find provider organization
                var providerOrg = await _context.Organizations
                    .FirstOrDefaultAsync(o => o.Type == Common.Enums.OrganizationType.SERVICE_PROVIDER);
                organizationId = providerOrg?.Id ?? Guid.Empty;
            }
            else if (user is ClientUser clientUser)
            {
                organizationId = clientUser.OrganizationId;
            }

            var auditLog = new AuditLog
            {
                EntityType = entityType,
                EntityId = entityId,
                Action = action,
                UserId = userId,
                OrganizationId = organizationId,
                Timestamp = DateTime.UtcNow,
                IpAddress = httpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty,
                UserAgent = httpContext?.Request?.Headers["User-Agent"].ToString() ?? string.Empty,
                AdditionalData = additionalData != null ? JsonSerializer.Serialize(additionalData) : string.Empty,
                IsSuccess = true
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsForEntityAsync(
            string entityType,
            Guid entityId)
        {
            return await _context.AuditLogs
                .Include(a => a.SystemUser)
                .Include(a => a.ClientUser)
                .Include(a => a.Organization)
                .Where(a => a.EntityType == entityType && a.EntityId == entityId)
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsForOrganizationAsync(
            Guid organizationId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            var query = _context.AuditLogs
                .Include(a => a.SystemUser)
                .Include(a => a.ClientUser)
                .Include(a => a.Organization)
                .Where(a => a.OrganizationId == organizationId);

            if (startDate.HasValue)
            {
                query = query.Where(a => a.Timestamp >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a => a.Timestamp <= endDate.Value);
            }

            return await query
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsForUserAsync(
            Guid userId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            var query = _context.AuditLogs
                .Include(a => a.SystemUser)
                .Include(a => a.ClientUser)
                .Include(a => a.Organization)
                .Where(a => a.UserId == userId);

            if (startDate.HasValue)
            {
                query = query.Where(a => a.Timestamp >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a => a.Timestamp <= endDate.Value);
            }

            return await query
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }
    }
}
