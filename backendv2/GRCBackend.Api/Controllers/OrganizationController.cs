using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GRCBackend.Core.Interfaces;
using GRCBackend.Application.DTOs;
using GRCBackend.Core.Entities;
using GRCBackend.Common.Enums;

namespace GRCBackend.Api.Controllers
{
    [ApiController]
    [Route("api/organizations")]  // Changed from [controller] to explicit 'organizations'
    [Authorize]
    public class OrganizationController : ControllerBase
    {
        private readonly IOrganizationService _organizationService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IAuditService _auditService;

        public OrganizationController(
            IOrganizationService organizationService,
            ICurrentUserService currentUserService,
            IAuditService auditService)
        {
            _organizationService = organizationService;
            _currentUserService = currentUserService;
            _auditService = auditService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrganizationDto>>> GetOrganizations([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var orgs = await _organizationService.GetClientOrganizationsAsync();
            return Ok(orgs.Select(MapToDto));
        }

        [HttpGet("provider")]
        public async Task<ActionResult<OrganizationDto>> GetProviderOrganization()
        {
            var org = await _organizationService.GetProviderOrganizationAsync();
            if (org == null)
            {
                return NotFound("Provider organization not found");
            }
            return Ok(MapToDto(org));
        }

        [HttpPost("provider")]
        [Authorize(Roles = "GlobalAdmin")] // Only global admins can create the provider org
        public async Task<ActionResult<OrganizationDto>> CreateProviderOrganization(CreateOrganizationDto dto)
        {
            if (await _organizationService.IsProviderOrganizationExistsAsync())
            {
                return BadRequest("Provider organization already exists");
            }

            var organization = new Organization
            {
                Name = dto.Name,
                Description = dto.Description,
                PrimaryContact = dto.PrimaryContact,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                RiskProfile = new RiskProfile
                {
                    BusinessFunctions = dto.BusinessFunctions,
                    KeyAssets = dto.KeyAssets,
                    ComplianceFrameworks = dto.ComplianceFrameworks,
                    DataTypes = dto.DataTypes,
                    OperationalRisk = dto.OperationalRisk,
                    DataSecurityRisk = dto.DataSecurityRisk,
                    ComplianceRisk = dto.ComplianceRisk,
                    FinancialRisk = dto.FinancialRisk
                }
            };

            var result = await _organizationService.CreateProviderOrganizationAsync(organization);
            return CreatedAtAction(nameof(GetProviderOrganization), MapToDto(result));
        }

        [HttpPut("provider")]
        [Authorize(Roles = "GlobalAdmin,ProviderAdmin")]
        public async Task<ActionResult<OrganizationDto>> UpdateProviderOrganization(UpdateOrganizationDto dto)
        {
            var org = await _organizationService.GetProviderOrganizationAsync();
            if (org == null)
            {
                return NotFound("Provider organization not found");
            }

            org.Name = dto.Name;
            org.Description = dto.Description;
            org.PrimaryContact = dto.PrimaryContact;
            org.Email = dto.Email;
            org.Phone = dto.Phone;
            org.Address = dto.Address;

            var result = await _organizationService.UpdateProviderOrganizationAsync(org);
            return Ok(MapToDto(result));
        }

        [HttpGet("clients")]
        public async Task<ActionResult<IEnumerable<OrganizationDto>>> GetClientOrganizations()
        {
            var orgs = await _organizationService.GetClientOrganizationsAsync();
            return Ok(orgs.Select(MapToDto));
        }

        [HttpGet("clients/{id}")]
        public async Task<ActionResult<OrganizationDto>> GetClientOrganization(Guid id)
        {
            var org = await _organizationService.GetClientOrganizationByIdAsync(id);
            if (org == null)
            {
                return NotFound();
            }
            return Ok(MapToDto(org));
        }

        [HttpPost("clients")]
        [Authorize(Roles = "GlobalAdmin,ProviderAdmin")]
        public async Task<ActionResult<OrganizationDto>> CreateClientOrganization(CreateOrganizationDto dto)
        {
            var organization = new Organization
            {
                Name = dto.Name,
                Description = dto.Description,
                PrimaryContact = dto.PrimaryContact,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                RiskProfile = new RiskProfile
                {
                    BusinessFunctions = dto.BusinessFunctions,
                    KeyAssets = dto.KeyAssets,
                    ComplianceFrameworks = dto.ComplianceFrameworks,
                    DataTypes = dto.DataTypes,
                    OperationalRisk = dto.OperationalRisk,
                    DataSecurityRisk = dto.DataSecurityRisk,
                    ComplianceRisk = dto.ComplianceRisk,
                    FinancialRisk = dto.FinancialRisk
                }
            };

            var result = await _organizationService.CreateClientOrganizationAsync(organization);
            return CreatedAtAction(nameof(GetClientOrganization), new { id = result.Id }, MapToDto(result));
        }

        [HttpPut("clients/{id}")]
        public async Task<ActionResult<OrganizationDto>> UpdateClientOrganization(Guid id, UpdateOrganizationDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            if (!await _organizationService.CanUserAccessOrganizationAsync(_currentUserService.UserId, id))
            {
                return Forbid();
            }

            var org = await _organizationService.GetClientOrganizationByIdAsync(id);
            if (org == null)
            {
                return NotFound();
            }

            org.Name = dto.Name;
            org.Description = dto.Description;
            org.PrimaryContact = dto.PrimaryContact;
            org.Email = dto.Email;
            org.Phone = dto.Phone;
            org.Address = dto.Address;

            var result = await _organizationService.UpdateClientOrganizationAsync(org);
            return Ok(MapToDto(result));
        }

        [HttpPut("{id}/risk-profile")]
        public async Task<ActionResult<RiskProfileDto>> UpdateRiskProfile(Guid id, UpdateRiskProfileDto dto)
        {
            if (id != dto.OrganizationId)
            {
                return BadRequest();
            }

            if (!await _organizationService.CanUserAccessOrganizationAsync(_currentUserService.UserId, id))
            {
                return Forbid();
            }

            var profile = new RiskProfile
            {
                OrganizationId = id,
                BusinessFunctions = dto.BusinessFunctions,
                KeyAssets = dto.KeyAssets,
                ComplianceFrameworks = dto.ComplianceFrameworks,
                DataTypes = dto.DataTypes,
                OperationalRisk = dto.OperationalRisk,
                DataSecurityRisk = dto.DataSecurityRisk,
                ComplianceRisk = dto.ComplianceRisk,
                FinancialRisk = dto.FinancialRisk,
                MitigationPlans = dto.MitigationPlans,
                NextReviewDate = dto.NextReviewDate
            };

            var result = await _organizationService.UpdateOrganizationRiskProfileAsync(id, profile);
            return Ok(MapToRiskProfileDto(result));
        }

        [HttpPost("{id}/activate")]
        [Authorize(Roles = "GlobalAdmin,ProviderAdmin")]
        public async Task<ActionResult> ActivateOrganization(Guid id)
        {
            var result = await _organizationService.ActivateOrganizationAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpPost("{id}/deactivate")]
        [Authorize(Roles = "GlobalAdmin,ProviderAdmin")]
        public async Task<ActionResult> DeactivateOrganization(Guid id)
        {
            var result = await _organizationService.DeactivateOrganizationAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return Ok();
        }

        private static OrganizationDto MapToDto(Organization org)
        {
            return new OrganizationDto
            {
                Id = org.Id,
                Name = org.Name,
                Type = org.Type,
                Description = org.Description,
                IsActive = org.IsActive,
                PrimaryContact = org.PrimaryContact,
                Email = org.Email,
                Phone = org.Phone,
                Address = org.Address,
                RiskProfile = org.RiskProfile != null ? MapToRiskProfileDto(org.RiskProfile) : null,
                CreatedAt = org.CreatedAt,
                UpdatedAt = org.UpdatedAt
            };
        }

        private static RiskProfileDto MapToRiskProfileDto(RiskProfile profile)
        {
            return new RiskProfileDto
            {
                Id = profile.Id,
                BusinessFunctions = profile.BusinessFunctions,
                KeyAssets = profile.KeyAssets,
                ComplianceFrameworks = profile.ComplianceFrameworks,
                DataTypes = profile.DataTypes,
                OperationalRisk = profile.OperationalRisk,
                DataSecurityRisk = profile.DataSecurityRisk,
                ComplianceRisk = profile.ComplianceRisk,
                FinancialRisk = profile.FinancialRisk,
                LastAssessmentDate = profile.LastAssessmentDate,
                LastAssessmentBy = profile.LastAssessmentBy,
                MitigationPlans = profile.MitigationPlans,
                NextReviewDate = profile.NextReviewDate
            };
        }
    }
}
