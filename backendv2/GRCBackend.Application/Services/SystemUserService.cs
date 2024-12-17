using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GRCBackend.Core.Interfaces;
using GRCBackend.Core.Entities;
using GRCBackend.Core.Models;

namespace GRCBackend.Application.Services
{
    public class SystemUserService : ISystemUserService
    {
        private readonly ISystemUserRepository _systemUserRepository;
        private readonly IAuditService _auditService;
        private readonly ICurrentUserService _currentUserService;

        public SystemUserService(
            ISystemUserRepository systemUserRepository,
            IAuditService auditService,
            ICurrentUserService currentUserService)
        {
            _systemUserRepository = systemUserRepository;
            _auditService = auditService;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<SystemUserDto>> GetAllAsync()
        {
            var users = await _systemUserRepository.GetAllAsync();
            return users.Select(MapToDto);
        }

        public async Task<SystemUserDto> GetByIdAsync(Guid id)
        {
            var user = await _systemUserRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"System user with ID {id} not found");
            }
            return MapToDto(user);
        }

        public async Task<SystemUserDto> GetByEmailAsync(string email)
        {
            var user = await _systemUserRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new KeyNotFoundException($"System user with email {email} not found");
            }
            return MapToDto(user);
        }

        public async Task<SystemUserDto> CreateAsync(CreateSystemUserDto dto)
        {
            if (await _systemUserRepository.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException($"Email {dto.Email} is already in use");
            }

            var user = new SystemUser
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Roles = dto.Roles ?? new List<string>(),
                OrganizationId = dto.OrganizationId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var success = await _systemUserRepository.CreateAsync(user);
            if (!success)
            {
                throw new InvalidOperationException("Failed to create system user");
            }

            await _auditService.LogAsync(
                "SystemUser",
                user.Id.ToString(),
                "Create",
                _currentUserService.UserId,
                new { user.Email, user.FirstName, user.LastName, user.Roles, user.OrganizationId }
            );

            return MapToDto(user);
        }

        public async Task<SystemUserDto> UpdateAsync(UpdateSystemUserDto dto)
        {
            var user = await _systemUserRepository.GetByIdAsync(dto.Id);
            if (user == null)
            {
                throw new KeyNotFoundException($"System user with ID {dto.Id} not found");
            }

            if (dto.Email != user.Email && await _systemUserRepository.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException($"Email {dto.Email} is already in use");
            }

            user.Email = dto.Email;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Roles = dto.Roles ?? new List<string>();
            user.OrganizationId = dto.OrganizationId;
            user.UpdatedAt = DateTime.UtcNow;

            var success = await _systemUserRepository.UpdateAsync(user);
            if (!success)
            {
                throw new InvalidOperationException("Failed to update system user");
            }

            await _auditService.LogAsync(
                "SystemUser",
                user.Id.ToString(),
                "Update",
                _currentUserService.UserId,
                new { user.Email, user.FirstName, user.LastName, user.Roles, user.OrganizationId }
            );

            return MapToDto(user);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _systemUserRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"System user with ID {id} not found");
            }

            var success = await _systemUserRepository.DeleteAsync(id);
            if (success)
            {
                await _auditService.LogAsync(
                    "SystemUser",
                    id.ToString(),
                    "Delete",
                    _currentUserService.UserId,
                    new { user.Email }
                );
            }

            return success;
        }

        public async Task<bool> UpdatePasswordAsync(Guid userId, SystemUserPasswordUpdateDto dto)
        {
            var user = await _systemUserRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"System user with ID {userId} not found");
            }

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            {
                throw new InvalidOperationException("Current password is incorrect");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            var success = await _systemUserRepository.UpdateAsync(user);
            if (success)
            {
                await _auditService.LogAsync(
                    "SystemUser",
                    userId.ToString(),
                    "PasswordUpdate",
                    _currentUserService.UserId,
                    new { user.Email }
                );
            }

            return success;
        }

        private static SystemUserDto MapToDto(SystemUser user)
        {
            return new SystemUserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive,
                LastLoginDate = user.LastLoginDate,
                Roles = user.Roles,
                OrganizationId = user.OrganizationId,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}
