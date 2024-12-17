using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Moq;
using FluentAssertions;
using GRCBackend.Core.Entities;
using GRCBackend.Core.Interfaces;
using GRCBackend.Common.Enums;
using GRCBackend.Infrastructure.Data;
using GRCBackend.Application.Services;

namespace GRCBackend.Application.Tests.Services
{
    public class OrganizationServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _dbContextOptions;
        private readonly Mock<ICurrentUserService> _currentUserServiceMock;
        private readonly Mock<IAuditService> _auditServiceMock;

        public OrganizationServiceTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _currentUserServiceMock = new Mock<ICurrentUserService>();
            _auditServiceMock = new Mock<IAuditService>();

            // Setup default audit service behavior
            _auditServiceMock.Setup(x => x.LogAsync(
                It.IsAny<string>(),
                It.IsAny<Guid>(),
                It.IsAny<string>(),
                It.IsAny<Guid>(),
                It.IsAny<Dictionary<string, string>>()))
                .Returns(Task.CompletedTask);
        }

        [Fact]
        public async Task CreateProviderOrganization_WhenNoProviderExists_ShouldSucceed()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var service = new OrganizationService(context, _currentUserServiceMock.Object, _auditServiceMock.Object);
            
            var organization = new Organization
            {
                Name = "Foxx Cyber",
                Type = OrganizationType.SERVICE_PROVIDER,
                IsServiceProvider = true,
                RiskProfile = new RiskProfile
                {
                    BusinessFunctions = "Test Functions",
                    KeyAssets = "Test Assets",
                    ComplianceFrameworks = new List<string> { "NIST" },
                    DataTypes = new List<string> { "PII" },
                    OperationalRisk = RiskLevel.LOW
                }
            };

            // Act
            var result = await service.CreateProviderOrganizationAsync(organization);

            // Assert
            result.Should().NotBeNull();
            result.Type.Should().Be(OrganizationType.SERVICE_PROVIDER);
            result.RiskProfile.Should().NotBeNull();
        }

        [Fact]
        public async Task CreateProviderOrganization_WhenProviderExists_ShouldThrowException()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var service = new OrganizationService(context, _currentUserServiceMock.Object, _auditServiceMock.Object);
            
            var existingProvider = new Organization
            {
                Name = "Existing Provider",
                Type = OrganizationType.SERVICE_PROVIDER,
                IsServiceProvider = true
            };
            context.Organizations.Add(existingProvider);
            await context.SaveChangesAsync();

            var newProvider = new Organization
            {
                Name = "New Provider",
                Type = OrganizationType.SERVICE_PROVIDER,
                IsServiceProvider = true
            };

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(
                () => service.CreateProviderOrganizationAsync(newProvider));
        }

        [Fact]
        public async Task ProviderUser_CanAccessAllClientOrganizations()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var service = new OrganizationService(context, _currentUserServiceMock.Object, _auditServiceMock.Object);

            var providerOrg = new Organization
            {
                Name = "Provider",
                Type = OrganizationType.SERVICE_PROVIDER,
                IsServiceProvider = true
            };
            context.Organizations.Add(providerOrg);

            var clientOrg = new Organization
            {
                Name = "Client",
                Type = OrganizationType.CLIENT,
                ProviderOrganizationId = providerOrg.Id
            };
            context.Organizations.Add(clientOrg);
            await context.SaveChangesAsync();

            var providerUser = new SystemUser { Id = Guid.NewGuid() };
            _currentUserServiceMock.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(providerUser);

            // Act
            var result = await service.GetClientOrganizationsAsync();

            // Assert
            result.Should().NotBeEmpty();
            result.Should().Contain(o => o.Id == clientOrg.Id);
        }

        [Fact]
        public async Task ClientUser_CanOnlyAccessOwnOrganization()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var service = new OrganizationService(context, _currentUserServiceMock.Object, _auditServiceMock.Object);

            var clientOrg1 = new Organization
            {
                Name = "Client 1",
                Type = OrganizationType.CLIENT
            };
            var clientOrg2 = new Organization
            {
                Name = "Client 2",
                Type = OrganizationType.CLIENT
            };
            context.Organizations.AddRange(clientOrg1, clientOrg2);
            await context.SaveChangesAsync();

            var clientUser = new ClientUser { Id = Guid.NewGuid() };
            _currentUserServiceMock.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(clientUser);

            // Act
            var result = await service.GetClientOrganizationsAsync();

            // Assert
            result.Should().NotBeEmpty();
            result.Should().HaveCount(1);
        }

        [Fact]
        public async Task UpdateRiskProfile_ShouldCreateAuditLog()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var service = new OrganizationService(context, _currentUserServiceMock.Object, _auditServiceMock.Object);

            var organization = new Organization
            {
                Name = "Test Org",
                Type = OrganizationType.CLIENT
            };
            context.Organizations.Add(organization);
            await context.SaveChangesAsync();

            var riskProfile = new RiskProfile
            {
                BusinessFunctions = "Updated Functions",
                KeyAssets = "Updated Assets",
                ComplianceFrameworks = new List<string> { "NIST", "ISO" },
                DataTypes = new List<string> { "PII", "PHI" },
                OperationalRisk = RiskLevel.MEDIUM
            };

            // Act
            await service.UpdateOrganizationRiskProfileAsync(organization.Id, riskProfile);

            // Assert
            _auditServiceMock.Verify(x => x.LogAsync(
                It.IsAny<string>(),
                It.IsAny<Guid>(),
                It.IsAny<string>(),
                It.IsAny<Guid>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once);
        }

        [Fact]
        public async Task DeactivateProviderOrganization_ShouldThrowException()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var service = new OrganizationService(context, _currentUserServiceMock.Object, _auditServiceMock.Object);

            var providerOrg = new Organization
            {
                Name = "Provider",
                Type = OrganizationType.SERVICE_PROVIDER,
                IsServiceProvider = true
            };
            context.Organizations.Add(providerOrg);
            await context.SaveChangesAsync();

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(
                () => service.DeactivateOrganizationAsync(providerOrg.Id));
        }

        [Fact]
        public async Task GetClientOrganization_WithInvalidAccess_ShouldThrowException()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            var service = new OrganizationService(context, _currentUserServiceMock.Object, _auditServiceMock.Object);

            var clientOrg = new Organization
            {
                Name = "Client",
                Type = OrganizationType.CLIENT
            };
            context.Organizations.Add(clientOrg);
            await context.SaveChangesAsync();

            _currentUserServiceMock.Setup(x => x.UserId).Returns(Guid.NewGuid());

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => service.GetClientOrganizationByIdAsync(clientOrg.Id));
        }
    }
}
