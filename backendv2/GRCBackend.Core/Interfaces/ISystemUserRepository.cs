using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GRCBackend.Core.Entities;

namespace GRCBackend.Core.Interfaces
{
    public interface ISystemUserRepository
    {
        Task<SystemUser?> GetByIdAsync(Guid id);
        Task<SystemUser?> GetByEmailAsync(string email);
        Task<SystemUser?> GetByRefreshTokenAsync(string refreshToken);
        Task<IEnumerable<SystemUser>> GetAllAsync();
        Task<bool> CreateAsync(SystemUser user);
        Task<bool> UpdateAsync(SystemUser user);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> EmailExistsAsync(string email);
    }
}
