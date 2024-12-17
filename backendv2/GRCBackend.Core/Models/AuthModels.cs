using System;
using System.Collections.Generic;

namespace GRCBackend.Core.Models
{
    // This is our domain model for authentication results
    public class AuthenticationResult
    {
        public bool Successful { get; private set; }
        public string[] Errors { get; private set; }
        public AuthenticatedUser? User { get; private set; }
        public string? AccessToken { get; private set; }
        public string? RefreshToken { get; private set; }

        private AuthenticationResult(bool success, AuthenticatedUser? user = null, string? accessToken = null, string? refreshToken = null, string[]? errors = null)
        {
            Successful = success;
            User = user;
            AccessToken = accessToken;
            RefreshToken = refreshToken;
            Errors = errors ?? Array.Empty<string>();
        }

        // Factory methods for creating authentication results
        public static AuthenticationResult Success(AuthenticatedUser user, string accessToken, string refreshToken)
            => new(true, user, accessToken, refreshToken);

        public static AuthenticationResult Failure(params string[] errors)
            => new(false, errors: errors);
    }

    // Base class for authenticated user information
    public abstract class AuthenticatedUser
    {
        public required string Id { get; init; }
        public required string Email { get; init; }
        public required string FirstName { get; init; }
        public required string LastName { get; init; }
        public bool IsActive { get; init; }
        public DateTime? LastLogin { get; init; }
        public abstract string UserType { get; }
    }

    // Specific implementation for system users
    public class AuthenticatedSystemUser : AuthenticatedUser
    {
        public required List<string> Permissions { get; init; }
        public override string UserType => "system";
    }

    // Specific implementation for client users
    public class AuthenticatedClientUser : AuthenticatedUser
    {
        public required string OrganizationId { get; init; }
        public required string OrganizationRole { get; init; }
        public override string UserType => "client";
    }
}