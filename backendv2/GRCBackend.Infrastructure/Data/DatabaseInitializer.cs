using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using GRCBackend.Core.Entities;
using GRCBackend.Common.Enums;
using BC = BCrypt.Net.BCrypt;

namespace GRCBackend.Infrastructure.Data
{
    public static class DatabaseInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;

            try
            {
                var context = services.GetRequiredService<ApplicationDbContext>();
                var configuration = services.GetRequiredService<IConfiguration>();
                var logger = services.GetRequiredService<ILogger<ApplicationDbContext>>();

                // Only create database if it doesn't exist
                logger.LogInformation("Ensuring database exists...");
                await context.Database.EnsureCreatedAsync();

                // Check if provider organization exists
                if (!await context.Organizations.AnyAsync(o => o.Type == OrganizationType.SERVICE_PROVIDER))
                {
                    logger.LogInformation("Creating provider organization...");
                    // Create provider organization
                    var foxxCyber = new Organization
                    {
                        Name = "Foxx Cyber",
                        Type = OrganizationType.SERVICE_PROVIDER,
                        Description = "Leading provider of GRC solutions and cybersecurity services",
                        IsActive = true,
                        IsServiceProvider = true,
                        PrimaryContact = "Admin",
                        Email = configuration["INITIAL_ADMIN_EMAIL"] ?? "admin@securecenter.com",
                        Phone = "(555) 123-4567",
                        Address = "123 Cyber Street, Security Valley, CA 94000",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        RiskProfile = new RiskProfile
                        {
                            BusinessFunctions = "GRC Platform Provider, Security Assessment Services, Compliance Management",
                            KeyAssets = "GRC Platform, Client Data, Assessment Tools",
                            ComplianceFrameworks = new List<string> { 
                                "NIST SP 800-53",
                                "ISO 27001",
                                "SOC 2"
                            },
                            DataTypes = new List<string> {
                                "Client Data",
                                "Assessment Results",
                                "Compliance Records"
                            },
                            OperationalRisk = RiskLevel.LOW,
                            DataSecurityRisk = RiskLevel.LOW,
                            ComplianceRisk = RiskLevel.LOW,
                            FinancialRisk = RiskLevel.LOW,
                            LastAssessmentDate = DateTime.UtcNow,
                            LastAssessmentBy = "System",
                            NextReviewDate = DateTime.UtcNow.AddMonths(6)
                        }
                    };

                    context.Organizations.Add(foxxCyber);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Provider organization created successfully");

                    // Seed system users
                    if (!await context.SystemUsers.AnyAsync())
                    {
                        logger.LogInformation("No system users found. Creating initial users...");

                        var adminEmail = configuration["INITIAL_ADMIN_EMAIL"] ?? "admin@securecenter.com";
                        var adminPassword = configuration["INITIAL_ADMIN_PASSWORD"] ?? "admin123!";
                        var basePassword = "systemUser!";

                        var systemUsers = new[]
                        {
                            new SystemUser // Default admin
                            {
                                Email = adminEmail,
                                PasswordHash = BC.HashPassword(adminPassword),
                                FirstName = "Admin",
                                LastName = "User",
                                IsActive = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                Roles = new List<string> { "GLOBAL_ADMIN" },
                                RefreshToken = string.Empty,
                                OrganizationId = foxxCyber.Id
                            },
                            new SystemUser // Additional global admins
                            {
                                Email = "globaladmin1@system.com",
                                PasswordHash = BC.HashPassword($"{basePassword}1"),
                                FirstName = "Global",
                                LastName = "Admin One",
                                IsActive = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                Roles = new List<string> { "GLOBAL_ADMIN" },
                                RefreshToken = string.Empty,
                                OrganizationId = foxxCyber.Id
                            },
                            new SystemUser
                            {
                                Email = "globaladmin2@system.com",
                                PasswordHash = BC.HashPassword($"{basePassword}2"),
                                FirstName = "Global",
                                LastName = "Admin Two",
                                IsActive = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                Roles = new List<string> { "GLOBAL_ADMIN" },
                                RefreshToken = string.Empty,
                                OrganizationId = foxxCyber.Id
                            },
                            new SystemUser // Regular admins
                            {
                                Email = "admin1@system.com",
                                PasswordHash = BC.HashPassword($"{basePassword}3"),
                                FirstName = "Admin",
                                LastName = "One",
                                IsActive = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                Roles = new List<string> { "ADMIN" },
                                RefreshToken = string.Empty,
                                OrganizationId = foxxCyber.Id
                            },
                            new SystemUser
                            {
                                Email = "admin2@system.com",
                                PasswordHash = BC.HashPassword($"{basePassword}4"),
                                FirstName = "Admin",
                                LastName = "Two",
                                IsActive = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                Roles = new List<string> { "ADMIN" },
                                RefreshToken = string.Empty,
                                OrganizationId = foxxCyber.Id
                            }
                        };

                        context.SystemUsers.AddRange(systemUsers);
                        await context.SaveChangesAsync();
                        logger.LogInformation("System users seeded successfully");
                    }
                }
                else
                {
                    logger.LogInformation("Provider organization already exists");
                }
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<ApplicationDbContext>>();
                logger.LogError(ex, "An error occurred while initializing the database.");
                throw;
            }
        }
    }
}
