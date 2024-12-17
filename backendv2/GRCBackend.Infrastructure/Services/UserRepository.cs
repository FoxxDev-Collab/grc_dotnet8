using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GRCBackend.Core.Entities;
using GRCBackend.Core.Interfaces;
using GRCBackend.Infrastructure.Data;

namespace GRCBackend.Infrastructure.Services
{
    public class SystemUserRepository : ISystemUserRepository
    {
        private readonly ApplicationDbContext _context;

        public SystemUserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SystemUser?> GetByIdAsync(Guid id)
        {
            return await _context.SystemUsers.FindAsync(id);
        }

        public async Task<SystemUser?> GetByEmailAsync(string email)
        {
            return await _context.SystemUsers
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<SystemUser?> GetByRefreshTokenAsync(string refreshToken)
        {
            return await _context.SystemUsers
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }

        public async Task<IEnumerable<SystemUser>> GetAllAsync()
        {
            return await _context.SystemUsers.ToListAsync();
        }

        public async Task<bool> CreateAsync(SystemUser user)
        {
            _context.SystemUsers.Add(user);
            var created = await _context.SaveChangesAsync();
            return created > 0;
        }

        public async Task<bool> UpdateAsync(SystemUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
            var updated = await _context.SaveChangesAsync();
            return updated > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _context.SystemUsers.FindAsync(id);
            if (user == null) return false;

            _context.SystemUsers.Remove(user);
            var deleted = await _context.SaveChangesAsync();
            return deleted > 0;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.SystemUsers
                .AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }
    }

    public class ClientUserRepository : IClientUserRepository
    {
        private readonly ApplicationDbContext _context;

        public ClientUserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ClientUser?> GetByIdAsync(Guid id)
        {
            return await _context.ClientUsers.FindAsync(id);
        }

        public async Task<ClientUser?> GetByEmailAsync(string email)
        {
            return await _context.ClientUsers
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<ClientUser?> GetByRefreshTokenAsync(string refreshToken)
        {
            return await _context.ClientUsers
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }

        public async Task<IEnumerable<ClientUser>> GetAllAsync()
        {
            return await _context.ClientUsers.ToListAsync();
        }

        public async Task<IEnumerable<ClientUser>> GetByOrganizationIdAsync(Guid organizationId)
        {
            return await _context.ClientUsers
                .Where(u => u.OrganizationId == organizationId)
                .ToListAsync();
        }

        public async Task<bool> CreateAsync(ClientUser user)
        {
            _context.ClientUsers.Add(user);
            var created = await _context.SaveChangesAsync();
            return created > 0;
        }

        public async Task<bool> UpdateAsync(ClientUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
            var updated = await _context.SaveChangesAsync();
            return updated > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _context.ClientUsers.FindAsync(id);
            if (user == null) return false;

            _context.ClientUsers.Remove(user);
            var deleted = await _context.SaveChangesAsync();
            return deleted > 0;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.ClientUsers
                .AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<bool> IsUserInOrganizationAsync(Guid userId, Guid organizationId)
        {
            return await _context.ClientUsers
                .AnyAsync(u => u.Id == userId && u.OrganizationId == organizationId);
        }
    }
}
