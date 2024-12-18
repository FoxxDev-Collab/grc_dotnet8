using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GRCBackend.Core.Interfaces;
using GRCBackend.Core.Interfaces.DTOs;
using GRCBackend.Core.Entities;
using GRCBackend.Application.DTOs.Users;

namespace GRCBackend.Application.Services
{
    public class SystemUserService : ISystemUserService
    {
        private readonly ISystemUserRepository _systemUserRepository;
        private readonly IAuditService _auditService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IOrganizationService _organizationService;

        public SystemUserService(
            ISystemUserRepository systemUserRepository,
            IAuditService auditService,
            ICurrentUserService currentUserService,
            IOrganizationService organizationService)
        {
            _systemUserRepository = systemUserRepository;
            _auditService = auditService;
            _currentUserService = currentUserService;
            _organizationService = organizationService;
        }

        public async Task<IEnumerable<ISystemUserDto>> GetAllAsync()
        {
            var users = await _systemUserRepository.GetAllAsync();
            var dtos = new List<SystemUserDto>();
            
            foreach (var user in users)
            {
                dtos.Add(MapToDto(user));
            }
            
            return dtos;
        }

        public async Task<ISystemUserDto> GetByIdAsync(Guid id)
        {
            var user = await _systemUserRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found");
            }

            return MapToDto(user);
        }

        public async Task<ISystemUserDto> GetByEmailAsync(string email)
        {
            var user = await _systemUserRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with email {email} not found");
            }

            return MapToDto(user);
        }

        public async Task<ISystemUserDto> CreateAsync(ICreateSystemUserDto dto)
        {
            // Check if email is already in use
            if (await _systemUserRepository.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException($"Email {dto.Email} is already in use");
            }

            // Get the provider organization
            var providerOrg = await _organizationService.GetProviderOrganizationAsync();
            if (providerOrg == null)
            {
                throw new InvalidOperationException("Provider organization not found");
            }

            var currentUser = _currentUserService.UserId;
            var now = DateTime.UtcNow;

            // Convert the single role to a list of roles
            var createDto = dto as CreateSystemUserDto;
            var roles = new List<string>();
            if (createDto?.Role != null)
            {
                roles.Add(createDto.Role);
            }
            else
            {
                roles.Add("PROVIDER_USER"); // Default role if none specified
            }

            var user = new SystemUser
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now,
                CreatedBy = currentUser.ToString(),
                UpdatedBy = currentUser.ToString(),
                LastLoginDate = null,
                Roles = roles,
                OrganizationId = providerOrg.Id,
                PasswordHash = dto.Password // Note: Infrastructure layer should hash this
            };

            var success = await _systemUserRepository.CreateAsync(user);
            if (!success)
            {
                throw new InvalidOperationException("Failed to create user");
            }

            await _auditService.LogAsync("SystemUser", user.Id, "Created", user.Id);
            
            // Fetch the created user to ensure we have the latest data
            var createdUser = await _systemUserRepository.GetByIdAsync(user.Id);
            if (createdUser == null)
            {
                throw new InvalidOperationException("User was created but could not be retrieved");
            }

            return MapToDto(createdUser);
        }

        public async Task<ISystemUserDto> UpdateAsync(IUpdateSystemUserDto dto)
        {
            var updateDto = (UpdateSystemUserDto)dto;
            
            var existingUser = await _systemUserRepository.GetByIdAsync(updateDto.Id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException($"User with ID {updateDto.Id} not found");
            }

            // Check if email is already in use by another user
            if (updateDto.Email != existingUser.Email && await _systemUserRepository.EmailExistsAsync(updateDto.Email))
            {
                throw new InvalidOperationException($"Email {updateDto.Email} is already in use");
            }

            existingUser.Email = updateDto.Email;
            existingUser.FirstName = updateDto.FirstName;
            existingUser.LastName = updateDto.LastName;
            existingUser.IsActive = updateDto.IsActive;
            existingUser.UpdatedAt = DateTime.UtcNow;
            existingUser.UpdatedBy = _currentUserService.UserId.ToString();
            existingUser.Roles = updateDto.Roles ?? existingUser.Roles;
            existingUser.OrganizationId = updateDto.OrganizationId;

            var success = await _systemUserRepository.UpdateAsync(existingUser);
            if (!success)
            {
                throw new InvalidOperationException("Failed to update user");
            }

            await _auditService.LogAsync("SystemUser", existingUser.Id, "Updated", existingUser.Id);

            // Fetch the updated user to ensure we have the latest data
            var updatedUser = await _systemUserRepository.GetByIdAsync(existingUser.Id);
            if (updatedUser == null)
            {
                throw new InvalidOperationException("User was updated but could not be retrieved");
            }

            return MapToDto(updatedUser);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _systemUserRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found");
            }

            var result = await _systemUserRepository.DeleteAsync(id);
            if (result)
            {
                await _auditService.LogAsync("SystemUser", id, "Deleted", id);
            }
            return result;
        }

        public async Task<bool> UpdatePasswordAsync(Guid userId, ISystemUserPasswordUpdateDto dto)
        {
            throw new NotImplementedException("Password updates are handled by the authentication service");
        }

        private SystemUserDto MapToDto(SystemUser user)
        {
            return new SystemUserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                LastLoginDate = user.LastLoginDate,
                Roles = user.Roles,
                OrganizationId = user.OrganizationId
            };
        }
    }
}
