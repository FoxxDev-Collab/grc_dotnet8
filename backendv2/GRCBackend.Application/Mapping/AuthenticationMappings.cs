using System;
using GRCBackend.Core.Models;
using GRCBackend.Core.Entities;
using GRCBackend.Application.DTOs;

namespace GRCBackend.Application.Mapping
{
    public static class AuthenticationMappings
    {
        public static SystemUserModel? ToModel(SystemUser? entity)
        {
            if (entity == null) return null;

            return new SystemUserModel
            {
                Id = entity.Id.ToString(),
                Email = entity.Email,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Role = entity.Roles?.FirstOrDefault() ?? "USER",
                IsActive = entity.IsActive,
                LastLogin = entity.LastLoginDate
            };
        }

        public static ClientUserModel? ToModel(ClientUser? entity)
        {
            if (entity == null) return null;

            return new ClientUserModel
            {
                Id = entity.Id.ToString(),
                Email = entity.Email,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                IsActive = entity.IsActive,
                LastLogin = entity.LastLoginDate,
                ClientRole = entity.ClientRole,
                OrganizationRole = entity.OrganizationRole,
                Organization = entity.Organization != null ? new OrganizationModel
                {
                    Id = entity.Organization.Id.ToString(),
                    Name = entity.Organization.Name
                } : null
            };
        }

        public static AuthenticationResponseDTO ToDto(AuthenticationResult model)
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

            var userDto = model.SystemUser != null ? MapSystemUser(model.SystemUser) :
                         model.ClientUser != null ? MapClientUser(model.ClientUser) :
                         defaultUser;

            return new AuthenticationResponseDTO
            {
                Success = model.Success,
                AccessToken = model.Token ?? string.Empty,
                RefreshToken = model.RefreshToken ?? string.Empty,
                Errors = model.Errors ?? Array.Empty<string>(),
                User = userDto
            };
        }

        private static UserDTO MapSystemUser(SystemUserModel user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                Type = "system",
                IsActive = user.IsActive,
                LastLogin = user.LastLogin?.ToString("O"),
                OrganizationId = null // System users don't have an organization
            };
        }

        private static UserDTO MapClientUser(ClientUserModel user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.ClientRole,
                Type = "client",
                IsActive = user.IsActive,
                LastLogin = user.LastLogin?.ToString("O"),
                OrganizationId = user.Organization?.Id
            };
        }
    }
}
