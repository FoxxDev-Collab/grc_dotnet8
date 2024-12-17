﻿// <auto-generated />
using System;
using GRCBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GRCBackend.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("GRCBackend.Core.Entities.AuditLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Action")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("AdditionalData")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<Guid>("EntityId")
                        .HasColumnType("uuid");

                    b.Property<string>("EntityType")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("ErrorMessage")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid?>("InformationSystemId")
                        .HasColumnType("uuid");

                    b.Property<string>("IpAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsSuccess")
                        .HasColumnType("boolean");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.Property<string>("UserAgent")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("InformationSystemId");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("UserId");

                    b.ToTable("AuditLogs", (string)null);
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.ClientUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ClientRole")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("LastLoginDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid");

                    b.Property<string>("OrganizationRole")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("OrganizationRoles")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime?>("RefreshTokenExpiryTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("OrganizationId");

                    b.ToTable("ClientUsers", (string)null);
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.InformationSystem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("AuthorizationBoundary")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime?>("AuthorizationDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Components")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ConfigurationManagement")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ContingencyPlan")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime?>("ContinuousMonitoringDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<string>("Dependencies")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime?>("DeploymentDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("IncidentResponsePlan")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("LastAssessmentDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("NetworkArchitecture")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RiskProfileId")
                        .HasColumnType("uuid");

                    b.Property<string>("SecurityCategorization")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("SecurityControls")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SystemOwner")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("SystemStatus")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SystemType")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("RiskProfileId");

                    b.ToTable("InformationSystems", (string)null);
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.MitigationPriority", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<string>("EstimatedCost")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid?>("InformationSystemId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid");

                    b.Property<int>("Priority")
                        .HasColumnType("integer");

                    b.Property<string>("Resources")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("ResponsibleParty")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Risk")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<string>("RiskArea")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Strategy")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("SuccessCriteria")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<int>("Timeframe")
                        .HasColumnType("integer");

                    b.Property<string>("Timeline")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("InformationSystemId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("MitigationPriorities", (string)null);
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.Organization", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsServiceProvider")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("PrimaryContact")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid?>("ProviderOrganizationId")
                        .HasColumnType("uuid");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ProviderOrganizationId");

                    b.HasIndex("Type")
                        .IsUnique()
                        .HasFilter("\"Type\" = 0");

                    b.ToTable("Organizations", (string)null);
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.QuantitativeRisk", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("AnnualLoss")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<int>("ImpactScore")
                        .HasColumnType("integer");

                    b.Property<Guid?>("InformationSystemId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid");

                    b.Property<decimal>("ProbabilityOfOccurrence")
                        .HasColumnType("numeric");

                    b.Property<decimal>("RiskScore")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("InformationSystemId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("QuantitativeRisks");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.RiskMatrixEntry", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<int>("Impact")
                        .HasColumnType("integer");

                    b.Property<Guid?>("InformationSystemId")
                        .HasColumnType("uuid");

                    b.Property<int>("Likelihood")
                        .HasColumnType("integer");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.Property<int>("Value")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("InformationSystemId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("RiskMatrixEntries");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.RiskProfile", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("BusinessFunctions")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("character varying(4000)");

                    b.Property<string>("ComplianceFrameworks")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("ComplianceRisk")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<int>("DataSecurityRisk")
                        .HasColumnType("integer");

                    b.Property<string>("DataTypes")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("FinancialRisk")
                        .HasColumnType("integer");

                    b.Property<string>("KeyAssets")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("character varying(4000)");

                    b.Property<string>("LastAssessmentBy")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<DateTime?>("LastAssessmentDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("MitigationPlans")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime?>("NextReviewDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("OperationalRisk")
                        .HasColumnType("integer");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId")
                        .IsUnique();

                    b.ToTable("RiskProfiles", (string)null);
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.SystemUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("LastLoginDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<DateTime?>("RefreshTokenExpiryTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Roles")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("UpdatedBy")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("SystemUsers", (string)null);
                });

            modelBuilder.Entity("OrganizationSystemUser", b =>
                {
                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("SystemUsersId")
                        .HasColumnType("uuid");

                    b.HasKey("OrganizationId", "SystemUsersId");

                    b.HasIndex("SystemUsersId");

                    b.ToTable("OrganizationSystemUsers", (string)null);
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.AuditLog", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.InformationSystem", null)
                        .WithMany("AuditLogs")
                        .HasForeignKey("InformationSystemId");

                    b.HasOne("GRCBackend.Core.Entities.Organization", "Organization")
                        .WithMany("AuditLogs")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("GRCBackend.Core.Entities.ClientUser", "ClientUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("GRCBackend.Core.Entities.SystemUser", "SystemUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("ClientUser");

                    b.Navigation("Organization");

                    b.Navigation("SystemUser");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.ClientUser", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.Organization", "Organization")
                        .WithMany("ClientUsers")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.InformationSystem", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.Organization", "Organization")
                        .WithMany("Systems")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("GRCBackend.Core.Entities.RiskProfile", "RiskProfile")
                        .WithMany()
                        .HasForeignKey("RiskProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");

                    b.Navigation("RiskProfile");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.MitigationPriority", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.InformationSystem", null)
                        .WithMany("MitigationPriorities")
                        .HasForeignKey("InformationSystemId");

                    b.HasOne("GRCBackend.Core.Entities.Organization", "Organization")
                        .WithMany("MitigationPriorities")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.Organization", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.Organization", "ProviderOrganization")
                        .WithMany("ClientOrganizations")
                        .HasForeignKey("ProviderOrganizationId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("ProviderOrganization");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.QuantitativeRisk", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.InformationSystem", null)
                        .WithMany("QuantitativeRisks")
                        .HasForeignKey("InformationSystemId");

                    b.HasOne("GRCBackend.Core.Entities.Organization", "Organization")
                        .WithMany("QuantitativeRisks")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.RiskMatrixEntry", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.InformationSystem", null)
                        .WithMany("RiskMatrix")
                        .HasForeignKey("InformationSystemId");

                    b.HasOne("GRCBackend.Core.Entities.Organization", "Organization")
                        .WithMany("RiskMatrix")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.RiskProfile", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.Organization", "Organization")
                        .WithOne("RiskProfile")
                        .HasForeignKey("GRCBackend.Core.Entities.RiskProfile", "OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("OrganizationSystemUser", b =>
                {
                    b.HasOne("GRCBackend.Core.Entities.Organization", null)
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GRCBackend.Core.Entities.SystemUser", null)
                        .WithMany()
                        .HasForeignKey("SystemUsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.InformationSystem", b =>
                {
                    b.Navigation("AuditLogs");

                    b.Navigation("MitigationPriorities");

                    b.Navigation("QuantitativeRisks");

                    b.Navigation("RiskMatrix");
                });

            modelBuilder.Entity("GRCBackend.Core.Entities.Organization", b =>
                {
                    b.Navigation("AuditLogs");

                    b.Navigation("ClientOrganizations");

                    b.Navigation("ClientUsers");

                    b.Navigation("MitigationPriorities");

                    b.Navigation("QuantitativeRisks");

                    b.Navigation("RiskMatrix");

                    b.Navigation("RiskProfile")
                        .IsRequired();

                    b.Navigation("Systems");
                });
#pragma warning restore 612, 618
        }
    }
}
