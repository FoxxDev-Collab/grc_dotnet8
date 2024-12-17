using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using GRCBackend.Application.Services;
using GRCBackend.Core.Interfaces;
using GRCBackend.Infrastructure.Data;
using GRCBackend.Infrastructure.Services;
using Npgsql;
using IAuthService = GRCBackend.Core.Interfaces.IAuthenticationService;
using AuthService = GRCBackend.Application.Services.AuthenticationService;
using System.Security.Claims;

// Load .env file before anything else
var envPath = Path.Combine(Directory.GetCurrentDirectory(), "..", ".env");
DotNetEnv.Env.Load(envPath);

var builder = WebApplication.CreateBuilder(args);

// Configure Npgsql to use legacy timestamp behavior
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Enhanced logging configuration
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Debug);
// Enable detailed ASP.NET Core logging
builder.Logging.AddFilter("Microsoft.AspNetCore", LogLevel.Debug);

// Load configuration
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add HttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];
if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT SecretKey is not configured");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        ClockSkew = TimeSpan.Zero,
        NameClaimType = ClaimTypes.NameIdentifier, // Maps to 'sub'
        RoleClaimType = ClaimTypes.Role // Maps to 'role'
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();

            // First try to get token from Authorization header
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            // If not found, try to get from cookie
            if (string.IsNullOrEmpty(token))
            {
                token = context.Request.Cookies["token"];
            }

            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
                logger.LogInformation("JWT Token received: {Token}", token);
            }
            else
            {
                logger.LogInformation("JWT Token received: no token");
            }

            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogError("Authentication failed: {Error}", context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            
            // Map the 'type' claim to a new claim that will be accessible in the User.Claims collection
            if (context.Principal?.Identity is ClaimsIdentity identity)
            {
                var typeClaim = identity.FindFirst("type");
                if (typeClaim != null)
                {
                    identity.AddClaim(new Claim("user_type", typeClaim.Value));
                }
            }
            
            logger.LogInformation("Token validated successfully");
            return Task.CompletedTask;
        }
    };
});

// Configure CORS
if (builder.Environment.IsDevelopment())
{
    // More permissive CORS policy for development
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder
                .SetIsOriginAllowed(_ => true) // Allow any origin in development
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithExposedHeaders("WWW-Authenticate", "Authorization")
                .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Cache preflight requests
        });
    });
}
else
{
    // Stricter CORS policy for production
    var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
    if (allowedOrigins == null || allowedOrigins.Length == 0)
    {
        allowedOrigins = new[] { "http://localhost:3000" }; // Default fallback
    }

    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder
                .WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithExposedHeaders("WWW-Authenticate", "Authorization")
                .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Cache preflight requests
        });
    });
}

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISystemUserRepository, SystemUserRepository>();
builder.Services.AddScoped<IClientUserRepository, ClientUserRepository>();
builder.Services.AddScoped<IOrganizationService, OrganizationService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetService<ApplicationDbContext>());
// Add SystemUserService registration
builder.Services.AddScoped<ISystemUserService, SystemUserService>();

// Configure Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Database connection string is not configured");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(connectionString,
        npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorCodesToAdd: null);
        });
});

var app = builder.Build();

// Get logger for middleware
var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Initialize Database
try
{
    logger.LogInformation("Initializing database...");
    await DatabaseInitializer.InitializeAsync(app.Services);
    logger.LogInformation("Database initialization completed successfully.");
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred while initializing the database.");
    throw;
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

// Request logging middleware
app.Use(async (context, next) =>
{
    // Log preflight requests
    if (context.Request.Method == "OPTIONS")
    {
        logger.LogInformation(
            "Preflight Request: {Method} {Path}\nHeaders: {Headers}",
            context.Request.Method,
            context.Request.Path,
            string.Join(", ", context.Request.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value.ToArray())}"))
        );
    }
    else
    {
        var requestBody = string.Empty;
        // Only log request body for specific content types
        if (context.Request.ContentType?.Contains("application/json") == true)
        {
            context.Request.EnableBuffering();
            using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, true, 1024, true);
            requestBody = await reader.ReadToEndAsync();
            context.Request.Body.Position = 0;
        }

        logger.LogInformation(
            "Request: {Method} {Path} {QueryString}\nHeaders: {Headers}\nBody: {Body}",
            context.Request.Method,
            context.Request.Path,
            context.Request.QueryString,
            string.Join(", ", context.Request.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value.ToArray())}")),
            requestBody
        );
    }

    // Capture the response body
    var originalBodyStream = context.Response.Body;
    using var responseBody = new MemoryStream();
    context.Response.Body = responseBody;

    try
    {
        await next.Invoke();

        responseBody.Seek(0, SeekOrigin.Begin);
        var responseContent = await new StreamReader(responseBody).ReadToEndAsync();
        responseBody.Seek(0, SeekOrigin.Begin);

        logger.LogInformation(
            "Response: {StatusCode}\nHeaders: {Headers}\nBody: {Body}",
            context.Response.StatusCode,
            string.Join(", ", context.Response.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value.ToArray())}")),
            responseContent
        );

        await responseBody.CopyToAsync(originalBodyStream);
    }
    finally
    {
        context.Response.Body = originalBodyStream;
    }
});

// CORS logging middleware
app.Use(async (context, next) =>
{
    var corsHeaders = context.Response.Headers.Where(h => h.Key.StartsWith("Access-Control-")).ToList();
    if (corsHeaders.Any())
    {
        logger.LogInformation("CORS Headers: {Headers}", 
            string.Join(", ", corsHeaders.Select(h => $"{h.Key}: {string.Join(", ", h.Value.ToArray())}")));
    }

    await next();
});

// Important: UseCors must be called before UseHttpsRedirection and Authentication
app.UseCors();

// Disable HTTPS redirection in development
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// Global error handling middleware
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An unhandled exception occurred.");
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { error = "An internal server error occurred.", details = ex.Message });
    }
});

app.MapControllers();

logger.LogInformation("Application starting...");
logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);
logger.LogInformation("CORS Policy: {Policy}", app.Environment.IsDevelopment() ? "Development (Allow All)" : "Production (Restricted)");

// Log the URLs the application is listening on
var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
logger.LogInformation("Application URLs: {Urls}", urls ?? "Using launch profile URLs");

app.Run();
