using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GRCBackend.Core.Interfaces;
using GRCBackend.Core.Models;

namespace GRCBackend.Api.Controllers
{
    [ApiController]
    [Route("api/system-users")]
    [Authorize]
    public class SystemUserController : ControllerBase
    {
        private readonly ISystemUserService _systemUserService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IAuditService _auditService;

        public SystemUserController(
            ISystemUserService systemUserService,
            ICurrentUserService currentUserService,
            IAuditService auditService)
        {
            _systemUserService = systemUserService;
            _currentUserService = currentUserService;
            _auditService = auditService;
        }

        [HttpGet]
        [Authorize(Roles = "GlobalAdmin,ProviderAdmin")]
        public async Task<ActionResult<IEnumerable<SystemUserDto>>> GetSystemUsers()
        {
            var users = await _systemUserService.GetAllAsync();
            // Wrap in data property to match frontend expectations
            return Ok(new { data = users });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "GlobalAdmin,ProviderAdmin")]
        public async Task<ActionResult<SystemUserDto>> GetSystemUser(Guid id)
        {
            try
            {
                var user = await _systemUserService.GetByIdAsync(id);
                return Ok(new { data = user });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"System user with ID {id} not found" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "GlobalAdmin")]
        public async Task<ActionResult<SystemUserDto>> CreateSystemUser(CreateSystemUserDto dto)
        {
            try
            {
                var user = await _systemUserService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetSystemUser), new { id = user.Id }, new { data = user });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "GlobalAdmin")]
        public async Task<ActionResult<SystemUserDto>> UpdateSystemUser(Guid id, UpdateSystemUserDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            try
            {
                var user = await _systemUserService.UpdateAsync(dto);
                return Ok(new { data = user });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"System user with ID {id} not found" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "GlobalAdmin")]
        public async Task<ActionResult> DeleteSystemUser(Guid id)
        {
            try
            {
                var result = await _systemUserService.DeleteAsync(id);
                if (result)
                {
                    return NoContent();
                }
                return BadRequest(new { message = "Failed to delete system user" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"System user with ID {id} not found" });
            }
        }

        [HttpPut("{id}/password")]
        public async Task<ActionResult> UpdatePassword(Guid id, SystemUserPasswordUpdateDto dto)
        {
            // Only allow users to update their own password unless they're a GlobalAdmin
            if (id != _currentUserService.UserId && !User.IsInRole("GlobalAdmin"))
            {
                return Forbid();
            }

            try
            {
                var result = await _systemUserService.UpdatePasswordAsync(id, dto);
                if (result)
                {
                    return NoContent();
                }
                return BadRequest(new { message = "Failed to update password" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"System user with ID {id} not found" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
