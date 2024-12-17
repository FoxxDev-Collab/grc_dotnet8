using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using GRCBackend.Common.Enums;

namespace GRCBackend.Application.DTOs
{
    public class CreateOrganizationDto
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string PrimaryContact { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [Phone]
        public required string Phone { get; set; }

        [Required]
        public required string Address { get; set; }

        // Risk Profile Information
        [Required]
        public required string BusinessFunctions { get; set; }

        [Required]
        public required string KeyAssets { get; set; }

        [Required]
        public required List<string> ComplianceFrameworks { get; set; }

        [Required]
        public required List<string> DataTypes { get; set; }

        public RiskLevel OperationalRisk { get; set; }
        public RiskLevel DataSecurityRisk { get; set; }
        public RiskLevel ComplianceRisk { get; set; }
        public RiskLevel FinancialRisk { get; set; }
    }

    public class UpdateOrganizationDto
    {
        public Guid Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string PrimaryContact { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [Phone]
        public required string Phone { get; set; }

        [Required]
        public required string Address { get; set; }
    }

    public class UpdateRiskProfileDto
    {
        public Guid OrganizationId { get; set; }

        [Required]
        public required string BusinessFunctions { get; set; }

        [Required]
        public required string KeyAssets { get; set; }

        [Required]
        public required List<string> ComplianceFrameworks { get; set; }

        [Required]
        public required List<string> DataTypes { get; set; }

        public RiskLevel OperationalRisk { get; set; }
        public RiskLevel DataSecurityRisk { get; set; }
        public RiskLevel ComplianceRisk { get; set; }
        public RiskLevel FinancialRisk { get; set; }

        public string? MitigationPlans { get; set; }
        public DateTime? NextReviewDate { get; set; }
    }

    public class OrganizationDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public OrganizationType Type { get; set; }
        public required string Description { get; set; }
        public bool IsActive { get; set; }
        public required string PrimaryContact { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required string Address { get; set; }
        public RiskProfileDto? RiskProfile { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class RiskProfileDto
    {
        public Guid Id { get; set; }
        public required string BusinessFunctions { get; set; }
        public required string KeyAssets { get; set; }
        public required List<string> ComplianceFrameworks { get; set; }
        public required List<string> DataTypes { get; set; }
        public RiskLevel OperationalRisk { get; set; }
        public RiskLevel DataSecurityRisk { get; set; }
        public RiskLevel ComplianceRisk { get; set; }
        public RiskLevel FinancialRisk { get; set; }
        public DateTime? LastAssessmentDate { get; set; }
        public string? LastAssessmentBy { get; set; }
        public string? MitigationPlans { get; set; }
        public DateTime? NextReviewDate { get; set; }
    }

    public class OrganizationSummaryDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public OrganizationType Type { get; set; }
        public bool IsActive { get; set; }
        public int SystemCount { get; set; }
        public int UserCount { get; set; }
        public DateTime LastActivityDate { get; set; }
    }
}
