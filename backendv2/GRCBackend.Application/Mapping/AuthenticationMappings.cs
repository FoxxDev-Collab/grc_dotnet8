using System;
using System.Linq;
using GRCBackend.Core.Models;
using GRCBackend.Core.Entities;
using GRCBackend.Application.DTOs;

namespace GRCBackend.Application.Mapping
{
    public static class AuthenticationMappings
    {
        public static AuthenticatedSystemUser? ToModel(SystemUser? entity)
        {
            if (entity == null) return null;

            return new AuthenticatedSystemUser
            {
                Id = entity.Id.ToString(),
                Email = entity.Email,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                IsActive = entity.IsActive,
                LastLogin = entity.LastLoginDate,
                Permissions = entity.Roles?.ToList() ?? new List<string>()
            };
        }

        public static AuthenticatedClientUser? ToModel(ClientUser? entity)
        {
            if (entity == null) return null;

            return new AuthenticatedClientUser
            {
                Id = entity.Id.ToString(),
                Email = entity.Email,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                IsActive = entity.IsActive,
                LastLogin = entity.LastLoginDate,
                OrganizationId = entity.Organization?.Id.ToString() ?? string.Empty,
                OrganizationRole = entity.OrganizationRole
            };
        }

        public static AuthenticationResponseDTO ToDto(AuthenticationResult result)
        {
            var defaultUser = new UserDTO
            {
                Id = Guid.NewGuid().ToString(),
                Email = "invalid@example.com",
                FirstName = "Invalid",
                LastName = "User",
                Role = "NONE",
                Type = "unknown",
                IsActive = false,
                LastLogin = null,
                OrganizationId = null
            };

            var userDto = result.User != null ? MapUser(result.User) : defaultUser;

            return new AuthenticationResponseDTO
            {
                Success = result.Successful,
                AccessToken = result.AccessToken ?? string.Empty,
                RefreshToken = result.RefreshToken ?? string.Empty,
                Errors = result.Errors ?? Array.Empty<string>(),
                User = userDto
            };
        }

        private static UserDTO MapUser(AuthenticatedUser user)
        {
            string role;
            string? organizationId = null;

            if (user is AuthenticatedSystemUser systemUser)
            {
                role = systemUser.Permissions.FirstOrDefault() ?? "USER";
            }
            else if (user is AuthenticatedClientUser authenticatedClientUser)
            {
                role = authenticatedClientUser.OrganizationRole;
                organizationId = authenticatedClientUser.OrganizationId;
            }
            else
            {
                role = "NONE";
            }

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = role,
                Type = user.UserType,
                IsActive = user.IsActive,
                LastLogin = user.LastLogin?.ToString("O"),
                OrganizationId = organizationId
            };
        }
    }
}
