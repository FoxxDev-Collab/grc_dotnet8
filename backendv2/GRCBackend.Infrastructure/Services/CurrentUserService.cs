using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using GRCBackend.Core.Interfaces;
using GRCBackend.Core.Entities;

namespace GRCBackend.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ISystemUserRepository _systemUserRepository;
        private readonly IClientUserRepository _clientUserRepository;

        public CurrentUserService(
            IHttpContextAccessor httpContextAccessor,
            ISystemUserRepository systemUserRepository,
            IClientUserRepository clientUserRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _systemUserRepository = systemUserRepository;
            _clientUserRepository = clientUserRepository;
        }

        public Guid UserId
        {
            get
            {
                var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    throw new UnauthorizedAccessException("User ID not found in claims");
                }
                return userId;
            }
        }

        public async Task<dynamic> GetCurrentUserAsync()
        {
            var userType = _httpContextAccessor.HttpContext?.User?.FindFirst("user_type")?.Value;
            
            if (string.IsNullOrEmpty(userType))
            {
                throw new UnauthorizedAccessException("User type not found in claims");
            }

            if (userType.Equals("system", StringComparison.OrdinalIgnoreCase))
            {
                return await _systemUserRepository.GetByIdAsync(UserId);
            }
            else if (userType.Equals("client", StringComparison.OrdinalIgnoreCase))
            {
                return await _clientUserRepository.GetByIdAsync(UserId);
            }

            throw new UnauthorizedAccessException($"Invalid user type: {userType}");
        }

        public async Task<bool> IsProviderUserAsync()
        {
            var user = await GetCurrentUserAsync();
            if (user is SystemUser systemUser)
            {
                return systemUser.Roles.Any(r => r.Equals("GLOBAL_ADMIN", StringComparison.OrdinalIgnoreCase) || 
                                               r.Equals("PROVIDER_ADMIN", StringComparison.OrdinalIgnoreCase));
            }
            return false;
        }

        public async Task<bool> IsClientUserAsync()
        {
            var user = await GetCurrentUserAsync();
            return user is ClientUser;
        }
    }
}
