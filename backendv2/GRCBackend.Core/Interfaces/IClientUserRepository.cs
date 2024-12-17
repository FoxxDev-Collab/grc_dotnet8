using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GRCBackend.Core.Entities;

namespace GRCBackend.Core.Interfaces
{
    public interface IClientUserRepository
    {
        Task<ClientUser?> GetByIdAsync(Guid id);
        Task<ClientUser?> GetByEmailAsync(string email);
        Task<ClientUser?> GetByRefreshTokenAsync(string refreshToken);
        Task<IEnumerable<ClientUser>> GetAllAsync();
        Task<IEnumerable<ClientUser>> GetByOrganizationIdAsync(Guid organizationId);
        Task<bool> CreateAsync(ClientUser user);
        Task<bool> UpdateAsync(ClientUser user);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> IsUserInOrganizationAsync(Guid userId, Guid organizationId);
    }
}
