using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GRCBackend.Core.Models;
using GRCBackend.Core.Interfaces.DTOs;

namespace GRCBackend.Core.Interfaces
{
    public interface ISystemUserService
    {
        Task<IEnumerable<ISystemUserDto>> GetAllAsync();
        Task<ISystemUserDto> GetByIdAsync(Guid id);
        Task<ISystemUserDto> GetByEmailAsync(string email);
        Task<ISystemUserDto> CreateAsync(ICreateSystemUserDto dto);
        Task<ISystemUserDto> UpdateAsync(IUpdateSystemUserDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> UpdatePasswordAsync(Guid userId, ISystemUserPasswordUpdateDto dto);
    }
}
