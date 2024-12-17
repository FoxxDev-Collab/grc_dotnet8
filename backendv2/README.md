1# GRC Platform Backend v2

This is the new .NET-based backend for the GRC Platform, designed to handle larger workloads and complex database operations more efficiently.

## Authentication System Migration

The authentication system has been migrated from NestJS to .NET, following clean architecture principles:

### Architecture Overview

- **Core Layer**: Contains business entities and interfaces
  - User entities (SystemUser, ClientUser)
  - Repository interfaces
  - Service interfaces

- **Application Layer**: Contains business logic
  - Authentication service implementation
  - DTOs for API contracts
  - Mapping profiles

- **Infrastructure Layer**: Contains implementation details
  - PostgreSQL database context
  - Repository implementations
  - Database migrations and seeding

- **API Layer**: Contains API endpoints and configuration
  - Authentication controllers
  - JWT middleware configuration
  - CORS and security settings

### Key Features

- Separate authentication flows for system and client users
- JWT-based authentication with refresh tokens
- Role-based authorization
- Email confirmation support
- Secure password hashing
- Database seeding for initial admin user
- Comprehensive error handling and logging

### Environment Configuration

Required environment variables in `.env`:

```env
# Database Configuration
ConnectionStrings__DefaultConnection=Server=localhost;Port=5433;Database=securecenter_dotnet;Username=dotnet_admin;Password=dotnet_secure_password;Include Error Detail=true

# JWT Settings
JwtSettings__SecretKey=your-super-secret-key-with-at-least-32-characters
JwtSettings__Issuer=GRCBackend
JwtSettings__Audience=GRCClient
JwtSettings__ExpirationHours=24
JwtSettings__RefreshTokenExpirationDays=7

# Initial Admin Account
INITIAL_ADMIN_EMAIL=admin@securecenter.com
INITIAL_ADMIN_PASSWORD=changeme123!
INITIAL_ADMIN_NAME="Global Administrator"
```

### API Endpoints

#### System Users
- POST `/api/auth/system/login`: System user login
- POST `/api/auth/refresh-token`: Refresh access token
- POST `/api/auth/revoke-token`: Revoke refresh token
- GET `/api/auth/validate-token`: Validate access token

#### Client Users
- POST `/api/auth/client/login`: Client user login
- Same token management endpoints as system users

### Migration Steps

1. Update environment variables in `.env`
2. Run database migrations:
   ```bash
   dotnet ef database update
   ```
3. Start the server:
   ```bash
   dotnet run
   ```
4. The initial admin user will be created automatically on first run

### Security Considerations

- JWT tokens are short-lived (24 hours by default)
- Refresh tokens are long-lived (7 days by default)
- Passwords are hashed using BCrypt
- CORS is configured for specific origins only
- All endpoints use HTTPS in production
- Rate limiting should be configured in production

### Next Steps

1. Implement user registration endpoints
2. Add password reset functionality
3. Implement organization management
4. Set up automated testing
5. Configure CI/CD pipeline
6. Add API documentation using Swagger
7. Implement rate limiting for production

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass
5. Update documentation as needed
