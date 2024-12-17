using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GRCBackend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Organizations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsServiceProvider = table.Column<bool>(type: "boolean", nullable: false),
                    PrimaryContact = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProviderOrganizationId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organizations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Organizations_Organizations_ProviderOrganizationId",
                        column: x => x.ProviderOrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SystemUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    LastLoginDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Roles = table.Column<string>(type: "text", nullable: false),
                    RefreshToken = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ClientUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    LastLoginDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    RefreshToken = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientRole = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OrganizationRole = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    OrganizationRoles = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClientUsers_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RiskProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BusinessFunctions = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    KeyAssets = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    ComplianceFrameworks = table.Column<string>(type: "text", nullable: false),
                    DataTypes = table.Column<string>(type: "text", nullable: false),
                    OperationalRisk = table.Column<int>(type: "integer", nullable: false),
                    DataSecurityRisk = table.Column<int>(type: "integer", nullable: false),
                    ComplianceRisk = table.Column<int>(type: "integer", nullable: false),
                    FinancialRisk = table.Column<int>(type: "integer", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    LastAssessmentDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastAssessmentBy = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    MitigationPlans = table.Column<string>(type: "text", nullable: false),
                    NextReviewDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RiskProfiles_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrganizationSystemUsers",
                columns: table => new
                {
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    SystemUsersId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationSystemUsers", x => new { x.OrganizationId, x.SystemUsersId });
                    table.ForeignKey(
                        name: "FK_OrganizationSystemUsers_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrganizationSystemUsers_SystemUsers_SystemUsersId",
                        column: x => x.SystemUsersId,
                        principalTable: "SystemUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InformationSystems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SecurityCategorization = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SystemType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AuthorizationBoundary = table.Column<string>(type: "text", nullable: false),
                    SystemOwner = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SystemStatus = table.Column<string>(type: "text", nullable: false),
                    DeploymentDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastAssessmentDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    AuthorizationDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ContinuousMonitoringDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    RiskProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    Components = table.Column<string>(type: "text", nullable: false),
                    Dependencies = table.Column<string>(type: "text", nullable: false),
                    NetworkArchitecture = table.Column<string>(type: "text", nullable: false),
                    SecurityControls = table.Column<string>(type: "text", nullable: false),
                    IncidentResponsePlan = table.Column<string>(type: "text", nullable: false),
                    ContingencyPlan = table.Column<string>(type: "text", nullable: false),
                    ConfigurationManagement = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InformationSystems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InformationSystems_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InformationSystems_RiskProfiles_RiskProfileId",
                        column: x => x.RiskProfileId,
                        principalTable: "RiskProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EntityType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    AdditionalData = table.Column<string>(type: "text", nullable: false),
                    IpAddress = table.Column<string>(type: "text", nullable: false),
                    UserAgent = table.Column<string>(type: "text", nullable: false),
                    IsSuccess = table.Column<bool>(type: "boolean", nullable: false),
                    ErrorMessage = table.Column<string>(type: "text", nullable: false),
                    InformationSystemId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuditLogs_ClientUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "ClientUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AuditLogs_InformationSystems_InformationSystemId",
                        column: x => x.InformationSystemId,
                        principalTable: "InformationSystems",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AuditLogs_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AuditLogs_SystemUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "SystemUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MitigationPriorities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Risk = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    Strategy = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Timeline = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Timeframe = table.Column<int>(type: "integer", nullable: false),
                    RiskArea = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SuccessCriteria = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Resources = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    EstimatedCost = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ResponsibleParty = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    InformationSystemId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MitigationPriorities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MitigationPriorities_InformationSystems_InformationSystemId",
                        column: x => x.InformationSystemId,
                        principalTable: "InformationSystems",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MitigationPriorities_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuantitativeRisks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnnualLoss = table.Column<decimal>(type: "numeric", nullable: false),
                    ProbabilityOfOccurrence = table.Column<decimal>(type: "numeric", nullable: false),
                    ImpactScore = table.Column<int>(type: "integer", nullable: false),
                    RiskScore = table.Column<decimal>(type: "numeric", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    InformationSystemId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuantitativeRisks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuantitativeRisks_InformationSystems_InformationSystemId",
                        column: x => x.InformationSystemId,
                        principalTable: "InformationSystems",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_QuantitativeRisks_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RiskMatrixEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Impact = table.Column<int>(type: "integer", nullable: false),
                    Likelihood = table.Column<int>(type: "integer", nullable: false),
                    Value = table.Column<int>(type: "integer", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    InformationSystemId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskMatrixEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RiskMatrixEntries_InformationSystems_InformationSystemId",
                        column: x => x.InformationSystemId,
                        principalTable: "InformationSystems",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RiskMatrixEntries_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_InformationSystemId",
                table: "AuditLogs",
                column: "InformationSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_OrganizationId",
                table: "AuditLogs",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_UserId",
                table: "AuditLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientUsers_Email",
                table: "ClientUsers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClientUsers_OrganizationId",
                table: "ClientUsers",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_InformationSystems_OrganizationId",
                table: "InformationSystems",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_InformationSystems_RiskProfileId",
                table: "InformationSystems",
                column: "RiskProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_MitigationPriorities_InformationSystemId",
                table: "MitigationPriorities",
                column: "InformationSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_MitigationPriorities_OrganizationId",
                table: "MitigationPriorities",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_ProviderOrganizationId",
                table: "Organizations",
                column: "ProviderOrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_Type",
                table: "Organizations",
                column: "Type",
                unique: true,
                filter: "\"Type\" = 0");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationSystemUsers_SystemUsersId",
                table: "OrganizationSystemUsers",
                column: "SystemUsersId");

            migrationBuilder.CreateIndex(
                name: "IX_QuantitativeRisks_InformationSystemId",
                table: "QuantitativeRisks",
                column: "InformationSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuantitativeRisks_OrganizationId",
                table: "QuantitativeRisks",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskMatrixEntries_InformationSystemId",
                table: "RiskMatrixEntries",
                column: "InformationSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskMatrixEntries_OrganizationId",
                table: "RiskMatrixEntries",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskProfiles_OrganizationId",
                table: "RiskProfiles",
                column: "OrganizationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SystemUsers_Email",
                table: "SystemUsers",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "MitigationPriorities");

            migrationBuilder.DropTable(
                name: "OrganizationSystemUsers");

            migrationBuilder.DropTable(
                name: "QuantitativeRisks");

            migrationBuilder.DropTable(
                name: "RiskMatrixEntries");

            migrationBuilder.DropTable(
                name: "ClientUsers");

            migrationBuilder.DropTable(
                name: "SystemUsers");

            migrationBuilder.DropTable(
                name: "InformationSystems");

            migrationBuilder.DropTable(
                name: "RiskProfiles");

            migrationBuilder.DropTable(
                name: "Organizations");
        }
    }
}
