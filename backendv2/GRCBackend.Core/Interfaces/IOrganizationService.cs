using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GRCBackend.Core.Entities;
using GRCBackend.Common.Enums;

namespace GRCBackend.Core.Interfaces
{
    public interface IOrganizationService
    {
        // Provider Organization Management
        Task<Organization?> GetProviderOrganizationAsync();
        Task<Organization> CreateProviderOrganizationAsync(Organization organization);
        Task<Organization> UpdateProviderOrganizationAsync(Organization organization);

        // Client Organization Management
        Task<Organization> CreateClientOrganizationAsync(Organization organization);
        Task<Organization> UpdateClientOrganizationAsync(Organization organization);
        Task<IEnumerable<Organization>> GetClientOrganizationsAsync();
        Task<Organization> GetClientOrganizationByIdAsync(Guid id);

        // Access Control
        Task<bool> CanUserAccessOrganizationAsync(Guid userId, Guid organizationId);
        Task<bool> CanUserPerformActionAsync(Guid userId, Guid organizationId, string action);
        
        // Risk Management
        Task<RiskProfile?> GetOrganizationRiskProfileAsync(Guid organizationId);
        Task<RiskProfile> UpdateOrganizationRiskProfileAsync(Guid organizationId, RiskProfile riskProfile);

        // Organization Status
        Task<bool> ActivateOrganizationAsync(Guid id);
        Task<bool> DeactivateOrganizationAsync(Guid id);

        // Validation
        Task<bool> ValidateOrganizationAsync(Organization organization);
        Task<bool> IsProviderOrganizationExistsAsync();
    }
}
