using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Notifications;
using soFlottOS.Api.Services.Security;
using soFlottOS.Api.Services.Email;

// ---------------------------------------------------------------------------
// Startup file ("composition root").
// It does four things, in this order:
//   1. read and validate configuration,
//   2. register every class the app needs (dependency injection),
//   3. build the HTTP pipeline (security, errors, routing),
//   4. prepare the database and start listening.
// ---------------------------------------------------------------------------

var builder = WebApplication.CreateBuilder(args);

// --- 1. Configuration ------------------------------------------------------
// Each options object is validated now so a bad deployment fails fast and loudly.
var jwtOptions = ReadOptions<JwtOptions>(builder.Configuration, JwtOptions.SectionName);
jwtOptions.Validate();

var pricingOptions = ReadOptions<PricingOptions>(builder.Configuration, PricingOptions.SectionName);
pricingOptions.Validate();

var routingOptions = ReadOptions<RoutingOptions>(builder.Configuration, RoutingOptions.SectionName);
routingOptions.Validate();

var notificationOptions = ReadOptions<NotificationOptions>(builder.Configuration, NotificationOptions.SectionName);
notificationOptions.Validate();

var invoicingOptions = ReadOptions<InvoicingOptions>(builder.Configuration, InvoicingOptions.SectionName);
invoicingOptions.Validate();

var emailOptions = ReadOptions<EmailOptions>(builder.Configuration, EmailOptions.SectionName);
emailOptions.Validate();
emailOptions.ValidateInvoicing(invoicingOptions);
if (emailOptions.Enabled && !builder.Environment.IsDevelopment() &&
    new Uri(emailOptions.FrontendBaseUrl).Scheme != Uri.UriSchemeHttps)
    throw new InvalidOperationException("Production email links require an HTTPS Email:FrontendBaseUrl.");

var seedOptions = ReadOptions<SeedOptions>(builder.Configuration, SeedOptions.SectionName);
seedOptions.Validate();

var databaseOptions = ReadOptions<DatabaseOptions>(builder.Configuration, DatabaseOptions.SectionName);

builder.Services.AddSingleton(jwtOptions);
builder.Services.AddSingleton(pricingOptions);
builder.Services.AddSingleton(routingOptions);
builder.Services.AddSingleton(notificationOptions);
builder.Services.AddSingleton(invoicingOptions);
builder.Services.AddSingleton(seedOptions);
builder.Services.AddSingleton(databaseOptions);
builder.Services.AddSingleton(emailOptions);
builder.Services.AddSingleton(TimeProvider.System);
var dataProtection = builder.Services.AddDataProtection().SetApplicationName("soFlottOS");
var keyPath = builder.Configuration["Authentication:DataProtectionKeyPath"];
if (!string.IsNullOrWhiteSpace(keyPath))
    dataProtection.PersistKeysToFileSystem(new DirectoryInfo(keyPath));
else if (emailOptions.Enabled && !builder.Environment.IsDevelopment())
    throw new InvalidOperationException("Password recovery requires a persistent Authentication:DataProtectionKeyPath in production.");

// --- 2. Dependency injection ----------------------------------------------

// 2a. Database (data layer).
var connectionString = NormalizePostgresConnectionString(
    builder.Configuration.GetConnectionString("Postgres")
    ?? throw new InvalidOperationException("ConnectionStrings:Postgres is missing."));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure()));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<DataSeeder>();

// 2b. Business logic (service layer).
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<MessageLocale>();
builder.Services.AddScoped<PasswordResetService>();
builder.Services.AddScoped<PasswordResetEmailOutbox>();
builder.Services.AddScoped<AccountSessionValidator>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<BookingAvailabilityService>();
builder.Services.AddScoped<IDriverService, DriverService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<INotificationQueue, NotificationQueue>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<IEmailQueue, EmailQueue>();
builder.Services.AddScoped<IEmailCommunications, EmailCommunications>();
builder.Services.AddSingleton<IEmailTemplateRenderer, EmailTemplateRenderer>();
builder.Services.AddScoped<EmailDispatcher>();
builder.Services.AddScoped<IBusinessTransaction, BusinessTransaction>();

// 2c. Outbound HTTP integrations.
builder.Services.AddMemoryCache();

builder.Services.AddHttpClient<IRoutingService, RoutingService>(client =>
{
    client.BaseAddress = new Uri(routingOptions.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(routingOptions.TimeoutSeconds);
});

// Address lookup talks to two different hosts, so it builds absolute URLs itself.
builder.Services.AddHttpClient<IGeocodingService, GeocodingService>(client =>
    client.Timeout = TimeSpan.FromSeconds(routingOptions.TimeoutSeconds));

builder.Services.AddHttpClient<INotificationSender, NotificationSender>(client =>
    client.BaseAddress = new Uri(notificationOptions.BaseUrl));

// Background job that delivers queued SMS notifications.
builder.Services.AddHostedService<NotificationWorker>();
builder.Services.AddHttpClient<IEmailSender, ResendEmailSender>(client =>
{
    client.BaseAddress = new Uri("https://api.resend.com/");
    client.Timeout = TimeSpan.FromSeconds(emailOptions.TimeoutSeconds);
}).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { AllowAutoRedirect = false });
builder.Services.AddHostedService<EmailWorker>();

// 2d. Web layer.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        // Send enums as readable strings ("Pending") instead of numbers.
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

// JWT authentication: who are you?
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var validator = context.HttpContext.RequestServices.GetRequiredService<AccountSessionValidator>();
                if (context.Principal is null ||
                    !await validator.IsCurrentAsync(context.Principal, context.HttpContext.RequestAborted))
                    context.Fail("This session is no longer valid. Please sign in again.");
            }
        };
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

// Role-based authorization: what may you do? (see [Authorize(Roles = ...)] on controllers)
builder.Services.AddAuthorization();

// Only the Next.js frontend may call this API from a browser.
builder.Services.AddCors(options => options.AddPolicy("frontend", policy =>
{
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
    if (allowedOrigins.Length == 0)
    {
        return;
    }

    policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
}));

// Basic abuse protection: 100 requests/minute per IP, 5/minute on the auth endpoints.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            }));

    options.AddFixedWindowLimiter("auth", limiter =>
    {
        limiter.PermitLimit = 5;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueLimit = 0;
        limiter.AutoReplenishment = true;
    });
});

// /healthz tells Docker or a load balancer whether the API (and PostgreSQL) is alive.
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database");

// Behind Render's TLS-terminating proxy: trust X-Forwarded-* so the client IP (rate limiting)
// and scheme are correct. The proxy is not loopback, so the default trusted lists are cleared.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

// --- 3. HTTP pipeline (order matters) --------------------------------------
app.UseForwardedHeaders();
app.UseExceptionHandler();

// The proxy handles HTTP->HTTPS; the container itself only listens on plain HTTP.
if (!app.Environment.IsDevelopment() && !string.Equals(
        Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER"), "true", StringComparison.OrdinalIgnoreCase))
{
    app.UseHttpsRedirection();
}

app.UseCors("frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    // Machine readable API description at /openapi/v1.json
    app.MapOpenApi();
}

app.MapHealthChecks("/healthz").AllowAnonymous();
app.MapControllers();

// --- 4. Database preparation ----------------------------------------------
await InitializeDatabaseAsync(app);

app.Run();

return;

/// <summary>Reads one configuration section into a typed object, failing when it is missing.</summary>
// Hosts such as Render provide postgres://user:pass@host:port/db; Npgsql expects key=value pairs.
static string NormalizePostgresConnectionString(string value)
{
    if (!value.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
        !value.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        return value;

    var uri = new Uri(value);
    var credentials = uri.UserInfo.Split(':', 2);
    return new Npgsql.NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.IsDefaultPort || uri.Port < 0 ? 5432 : uri.Port,
        Database = uri.AbsolutePath.Trim('/'),
        Username = Uri.UnescapeDataString(credentials[0]),
        Password = credentials.Length > 1 ? Uri.UnescapeDataString(credentials[1]) : null,
        SslMode = Npgsql.SslMode.Prefer
    }.ConnectionString;
}

static T ReadOptions<T>(IConfiguration configuration, string sectionName)
    where T : class, new()
{
    var section = configuration.GetSection(sectionName);
    if (!section.Exists())
    {
        throw new InvalidOperationException($"Configuration section '{sectionName}' is missing.");
    }

    return section.Get<T>() ?? throw new InvalidOperationException($"Configuration section '{sectionName}' is invalid.");
}

/// <summary>Applies pending migrations and seeds development data.</summary>
static async Task InitializeDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();

    var options = scope.ServiceProvider.GetRequiredService<DatabaseOptions>();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (options.ApplyMigrationsOnStartup)
    {
        await dbContext.Database.MigrateAsync();
    }

    await scope.ServiceProvider.GetRequiredService<DataSeeder>().SeedAsync();
}
