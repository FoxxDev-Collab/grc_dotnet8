using System;
using System.Threading.Tasks;
using GRCBackend.Core.Entities;

namespace GRCBackend.Core.Interfaces
{
    public interface ICurrentUserService
    {
        Guid UserId { get; }
        Task<dynamic> GetCurrentUserAsync(); // Returns either SystemUser or ClientUser
        Task<bool> IsProviderUserAsync();
        Task<bool> IsClientUserAsync();
    }
}
