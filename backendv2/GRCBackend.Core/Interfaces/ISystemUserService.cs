using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GRCBackend.Core.Models;

namespace GRCBackend.Core.Interfaces
{
    public interface ISystemUserService
    {
        Task<IEnumerable<SystemUserDto>> GetAllAsync();
        Task<SystemUserDto> GetByIdAsync(Guid id);
        Task<SystemUserDto> GetByEmailAsync(string email);
        Task<SystemUserDto> CreateAsync(CreateSystemUserDto dto);
        Task<SystemUserDto> UpdateAsync(UpdateSystemUserDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> UpdatePasswordAsync(Guid userId, SystemUserPasswordUpdateDto dto);
    }
}
