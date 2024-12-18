using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GRCBackend.Core.Interfaces;
using GRCBackend.Core.Interfaces.DTOs;
using GRCBackend.Application.DTOs;

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
        [Authorize(Roles = "GLOBAL_ADMIN,PROVIDER_ADMIN")]
        public async Task<ActionResult<IEnumerable<SystemUserDto>>> GetSystemUsers()
        {
            var users = await _systemUserService.GetAllAsync();
            return Ok(new { data = users });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "GLOBAL_ADMIN,PROVIDER_ADMIN")]
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
        [Authorize(Roles = "GLOBAL_ADMIN")]
        public async Task<ActionResult<SystemUserDto>> CreateSystemUser([FromBody] CreateSystemUserDto createDto)
        {
            try
            {
                var user = await _systemUserService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetSystemUser), new { id = user.Id }, new { data = user });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "GLOBAL_ADMIN")]
        public async Task<ActionResult<SystemUserDto>> UpdateSystemUser(Guid id, [FromBody] UpdateSystemUserDto updateDto)
        {
            if (id != updateDto.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            try
            {
                var user = await _systemUserService.UpdateAsync(updateDto);
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
        [Authorize(Roles = "GLOBAL_ADMIN")]
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
        public async Task<ActionResult> UpdatePassword(Guid id, [FromBody] SystemUserPasswordUpdateDto passwordDto)
        {
            // Only allow users to update their own password unless they're a GLOBAL_ADMIN
            if (id != _currentUserService.UserId && !User.IsInRole("GLOBAL_ADMIN"))
            {
                return Forbid();
            }

            try
            {
                var result = await _systemUserService.UpdatePasswordAsync(id, passwordDto);
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
