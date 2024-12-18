using System;

namespace GRCBackend.Core.Interfaces.DTOs
{
    public interface ISystemUserDto
    {
        Guid Id { get; set; }
        string Email { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
        bool IsActive { get; set; }
        DateTime CreatedAt { get; set; }
        DateTime? UpdatedAt { get; set; }
    }

    public interface ICreateSystemUserDto
    {
        string Email { get; set; }
        string Password { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
    }

    public interface IUpdateSystemUserDto
    {
        Guid Id { get; set; }
        string Email { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
        bool IsActive { get; set; }
    }

    public interface ISystemUserPasswordUpdateDto
    {
        string CurrentPassword { get; set; }
        string NewPassword { get; set; }
        string ConfirmNewPassword { get; set; }
    }
}