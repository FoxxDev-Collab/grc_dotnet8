using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GRCBackend.Core.Entities;
using GRCBackend.Core.Interfaces;
using GRCBackend.Common.Enums;
using GRCBackend.Application.DTOs;

namespace GRCBackend.Application.Services
{
    public class OrganizationService : IOrganizationService
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IAuditService _auditService;

        public OrganizationService(
            IApplicationDbContext context,
            ICurrentUserService currentUserService,
            IAuditService auditService)
        {
            _context = context;
            _currentUserService = currentUserService;
            _auditService = auditService;
        }

        private async Task<Organization?> GetUserOrganizationAsync(Guid userId)
        {
            // Check SystemUsers
            var systemUserOrg = await _context.Organizations
                .FirstOrDefaultAsync(o => o.SystemUsers.Any(u => u.Id == userId));

            if (systemUserOrg != null)
            {
                return systemUserOrg;
            }

            // Check ClientUsers
            var clientUserOrg = await _context.Organizations
                .FirstOrDefaultAsync(o => o.ClientUsers.Any(u => u.Id == userId));

            return clientUserOrg;
        }

        public async Task<Organization?> GetProviderOrganizationAsync()
        {
            return await _context.Organizations
                .Include(o => o.RiskProfile)
                .FirstOrDefaultAsync(o => o.Type == OrganizationType.SERVICE_PROVIDER && o.IsActive);
        }

        public async Task<Organization> CreateProviderOrganizationAsync(Organization organization)
        {
            var existingProvider = await IsProviderOrganizationExistsAsync();
            if (existingProvider)
            {
                throw new InvalidOperationException("A Provider organization already exists");
            }

            organization.Type = OrganizationType.SERVICE_PROVIDER;
            await ValidateOrganizationAsync(organization);

            _context.Organizations.Add(organization);
            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                "Organization",
                organization.Id,
                "Created Provider Organization",
                _currentUserService.UserId);

            return organization;
        }

        public async Task<Organization> UpdateProviderOrganizationAsync(Organization organization)
        {
            var existingOrg = await _context.Organizations
                .Include(o => o.RiskProfile)
                .FirstOrDefaultAsync(o => o.Id == organization.Id && o.Type == OrganizationType.SERVICE_PROVIDER);

            if (existingOrg == null)
            {
                throw new InvalidOperationException("Provider organization not found");
            }

            // Prevent changing organization type
            organization.Type = OrganizationType.SERVICE_PROVIDER;
            await ValidateOrganizationAsync(organization);

            _context.Organizations.Update(organization);
            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                "Organization",
                organization.Id,
                "Updated Provider Organization",
                _currentUserService.UserId);

            return organization;
        }

        public async Task<Organization> CreateClientOrganizationAsync(Organization organization)
        {
            var provider = await GetProviderOrganizationAsync();
            if (provider == null)
            {
                throw new InvalidOperationException("Provider organization must exist before creating client organizations");
            }

            organization.Type = OrganizationType.CLIENT;
            organization.ProviderOrganizationId = provider.Id;
            await ValidateOrganizationAsync(organization);

            _context.Organizations.Add(organization);
            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                "Organization",
                organization.Id,
                "Created Client Organization",
                _currentUserService.UserId);

            return organization;
        }

        public async Task<Organization> UpdateClientOrganizationAsync(Organization organization)
        {
            var existingOrg = await _context.Organizations
                .Include(o => o.RiskProfile)
                .FirstOrDefaultAsync(o => o.Id == organization.Id && o.Type == OrganizationType.CLIENT);

            if (existingOrg == null)
            {
                throw new InvalidOperationException("Client organization not found");
            }

            // Prevent changing organization type
            organization.Type = OrganizationType.CLIENT;
            await ValidateOrganizationAsync(organization);

            _context.Organizations.Update(organization);
            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                "Organization",
                organization.Id,
                "Updated Client Organization",
                _currentUserService.UserId);

            return organization;
        }

        public async Task<IEnumerable<Organization>> GetClientOrganizationsAsync()
        {
            var currentUser = await _currentUserService.GetCurrentUserAsync();
            var userId = currentUser?.Id ?? Guid.Empty;

            var userOrg = await GetUserOrganizationAsync(userId);

            // Provider users can see all client organizations
            if (userOrg?.Type == OrganizationType.SERVICE_PROVIDER)
            {
                return await _context.Organizations
                    .Include(o => o.RiskProfile)
                    .Where(o => o.Type == OrganizationType.CLIENT && o.IsActive)
                    .ToListAsync();
            }

            // Client users can only see their own organization
            return userOrg != null ? new List<Organization> { userOrg } : new List<Organization>();
        }

        public async Task<Organization> GetClientOrganizationByIdAsync(Guid id)
        {
            var organization = await _context.Organizations
                .Include(o => o.RiskProfile)
                .FirstOrDefaultAsync(o => o.Id == id && o.Type == OrganizationType.CLIENT);

            if (organization == null)
            {
                throw new InvalidOperationException("Client organization not found");
            }

            if (!await CanUserAccessOrganizationAsync(_currentUserService.UserId, id))
            {
                throw new UnauthorizedAccessException("User does not have access to this organization");
            }

            return organization;
        }

        public async Task<IEnumerable<object>> GetOrganizationUsersAsync(Guid organizationId, int page, int pageSize)
        {
            if (!await CanUserAccessOrganizationAsync(_currentUserService.UserId, organizationId))
            {
                throw new UnauthorizedAccessException("User does not have access to this organization");
            }

            var organization = await _context.Organizations
                .Include(o => o.SystemUsers)
                .Include(o => o.ClientUsers)
                .FirstOrDefaultAsync(o => o.Id == organizationId);

            if (organization == null)
            {
                throw new InvalidOperationException("Organization not found");
            }

            var users = new List<UserDTO>();

            // Add system users
            users.AddRange(organization.SystemUsers.Select(u => new UserDTO
            {
                Id = u.Id.ToString(),
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Roles.FirstOrDefault() ?? "USER",
                Type = "system",
                IsActive = u.IsActive,
                LastLogin = u.LastLoginDate?.ToString("O")
            }));

            // Add client users
            users.AddRange(organization.ClientUsers.Select(u => new UserDTO
            {
                Id = u.Id.ToString(),
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.OrganizationRole,
                Type = "client",
                IsActive = u.IsActive,
                LastLogin = u.LastLoginDate?.ToString("O"),
                OrganizationId = organizationId.ToString()
            }));

            // Apply pagination
            return users
                .OrderBy(u => u.Email)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);
        }

        public async Task<bool> CanUserAccessOrganizationAsync(Guid userId, Guid organizationId)
        {
            var userOrg = await GetUserOrganizationAsync(userId);

            // Provider users can access all organizations
            if (userOrg?.Type == OrganizationType.SERVICE_PROVIDER)
            {
                return true;
            }

            // Client users can only access their own organization
            return userOrg?.Id == organizationId;
        }

        public async Task<bool> CanUserPerformActionAsync(Guid userId, Guid organizationId, string action)
        {
            var userOrg = await GetUserOrganizationAsync(userId);

            // Only Provider users can perform certain actions
            if (action == "ApproveCompliance" || action == "FinalizeAssessment")
            {
                return userOrg?.Type == OrganizationType.SERVICE_PROVIDER;
            }

            return await CanUserAccessOrganizationAsync(userId, organizationId);
        }

        public async Task<RiskProfile?> GetOrganizationRiskProfileAsync(Guid organizationId)
        {
            if (!await CanUserAccessOrganizationAsync(_currentUserService.UserId, organizationId))
            {
                throw new UnauthorizedAccessException("User does not have access to this organization");
            }

            return await _context.RiskProfiles
                .FirstOrDefaultAsync(rp => rp.OrganizationId == organizationId);
        }

        public async Task<RiskProfile> UpdateOrganizationRiskProfileAsync(Guid organizationId, RiskProfile riskProfile)
        {
            if (!await CanUserAccessOrganizationAsync(_currentUserService.UserId, organizationId))
            {
                throw new UnauthorizedAccessException("User does not have access to this organization");
            }

            var existingProfile = await _context.RiskProfiles
                .FirstOrDefaultAsync(rp => rp.OrganizationId == organizationId);

            if (existingProfile == null)
            {
                riskProfile.OrganizationId = organizationId;
                _context.RiskProfiles.Add(riskProfile);
            }
            else
            {
                _context.RiskProfiles.Update(riskProfile);
            }

            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                "RiskProfile",
                organizationId,
                "Updated Risk Profile",
                _currentUserService.UserId);

            return riskProfile;
        }

        public async Task<bool> ActivateOrganizationAsync(Guid id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization == null)
            {
                return false;
            }

            organization.IsActive = true;
            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                "Organization",
                id,
                "Activated Organization",
                _currentUserService.UserId);

            return true;
        }

        public async Task<bool> DeactivateOrganizationAsync(Guid id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization == null)
            {
                return false;
            }

            if (organization.Type == OrganizationType.SERVICE_PROVIDER)
            {
                throw new InvalidOperationException("Cannot deactivate the Provider organization");
            }

            organization.IsActive = false;
            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                "Organization",
                id,
                "Deactivated Organization",
                _currentUserService.UserId);

            return true;
        }

        public async Task<bool> ValidateOrganizationAsync(Organization organization)
        {
            if (string.IsNullOrWhiteSpace(organization.Name))
            {
                throw new ArgumentException("Organization name is required");
            }

            var existingOrg = await _context.Organizations
                .FirstOrDefaultAsync(o => o.Name == organization.Name && o.Id != organization.Id);

            if (existingOrg != null)
            {
                throw new InvalidOperationException("Organization name must be unique");
            }

            return true;
        }

        public async Task<bool> IsProviderOrganizationExistsAsync()
        {
            return await _context.Organizations
                .AnyAsync(o => o.Type == OrganizationType.SERVICE_PROVIDER && o.IsActive);
        }

        private bool IsGlobalAdmin(string role)
        {
            return string.Equals(role, "GLOBAL_ADMIN", StringComparison.OrdinalIgnoreCase);
        }
    }
}
