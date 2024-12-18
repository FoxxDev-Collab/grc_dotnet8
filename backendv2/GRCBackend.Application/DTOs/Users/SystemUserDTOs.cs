using System;
using System.Collections.Generic;
using GRCBackend.Core.Interfaces.DTOs;

namespace GRCBackend.Application.DTOs.Users
{
    public class SystemUserDto : ISystemUserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Additional properties beyond interface
        public DateTime? LastLoginDate { get; set; }
        public List<string> Roles { get; set; }
        public Guid? OrganizationId { get; set; }
    }

    public class CreateSystemUserDto : ICreateSystemUserDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        
        // Additional properties beyond interface
        public List<string> Roles { get; set; }
        public Guid? OrganizationId { get; set; }
    }

    public class UpdateSystemUserDto : IUpdateSystemUserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }
        
        // Additional properties beyond interface
        public List<string> Roles { get; set; }
        public Guid? OrganizationId { get; set; }
    }

    public class SystemUserPasswordUpdateDto : ISystemUserPasswordUpdateDto
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
    }
}
