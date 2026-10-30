using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Security;
using soFlottOS.Api.Services.Email;

namespace soFlottOS.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);

    Task<AuthResponse> RegisterClientAsync(RegisterClientRequest request, CancellationToken cancellationToken = default);

    Task<AuthResponse> RegisterDriverAsync(RegisterDriverRequest request, CancellationToken cancellationToken = default);

    Task<CurrentUserResponse> GetCurrentUserAsync(CurrentUser currentUser, CancellationToken cancellationToken = default);
}

/// <summary>
/// Sign-in and sign-up.
/// A business signing up gets two records: a login <see cref="User"/> and a CRM <see cref="Client"/>.
/// A driver signing up gets a login user that starts Offline.
/// Admin accounts are never created publicly - they are seeded or created in the database.
/// </summary>
public sealed class AuthService(
    IUserRepository userRepository,
    IClientRepository clientRepository,
    IPasswordHasher passwordHasher,
    ITokenService tokenService,
    IEmailCommunications emails, MessageLocale? locale = null) : IAuthService
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IClientRepository _clientRepository = clientRepository;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly ITokenService _tokenService = tokenService;

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var email = Normalize(request.Email);
        var user = await _userRepository.GetByEmailAsync(email, cancellationToken);

        // Same message for "unknown email" and "wrong password" so attackers
        // cannot find out which accounts exist.
        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("The supplied email or password is invalid.");
        }

        if (locale?.Selected is { } selected && user.PreferredLocale != selected)
        {
            user.PreferredLocale = selected;
            await _userRepository.SaveChangesAsync(cancellationToken);
        }
        return await CreateAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> RegisterClientAsync(
        RegisterClientRequest request,
        CancellationToken cancellationToken = default)
    {
        PasswordPolicy.Validate(request.Password);
        var email = Normalize(request.Email);
        await EnsureEmailIsFreeAsync(email, cancellationToken);

        var user = new User
        {
            Email = email,
            PreferredLocale = locale?.Current ?? "de",
            PasswordHash = _passwordHasher.Hash(request.Password),
            FullName = request.ContactPerson.Trim(),
            Role = UserRole.Client,
            Phone = request.Phone.Trim()
        };

        // The CRM record is created together with the login account, so the new
        // business can book its first delivery immediately after signing up.
        var client = new Client
        {
            User = user,
            CompanyName = request.CompanyName.Trim(),
            ContactPerson = request.ContactPerson.Trim(),
            Email = email,
            Phone = request.Phone.Trim(),
            Street = request.Street.Trim(),
            City = request.City.Trim(),
            PostalCode = request.PostalCode.Trim(),
            Country = request.Country.Trim(),
            TaxIdNumber = Clean(request.TaxIdNumber)
        };

        emails.AccountCreated(user);
        await _clientRepository.AddAsync(client, cancellationToken);

        return CreateAuthResponse(user, client.Id);
    }

    public async Task<AuthResponse> RegisterDriverAsync(
        RegisterDriverRequest request,
        CancellationToken cancellationToken = default)
    {
        PasswordPolicy.Validate(request.Password);
        var email = Normalize(request.Email);
        await EnsureEmailIsFreeAsync(email, cancellationToken);

        var driver = new User
        {
            Email = email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            FullName = request.FullName.Trim(),
            PreferredLocale = locale?.Current ?? "de",
            Role = UserRole.Driver,
            Phone = request.Phone.Trim(),
            VehicleDescription = Clean(request.VehicleDescription),

            // New drivers decide for themselves when they go Online.
            Availability = DriverAvailability.Offline
        };

        emails.AccountCreated(driver);
        await _userRepository.AddAsync(driver, cancellationToken);

        return CreateAuthResponse(driver, clientId: null);
    }

    public async Task<CurrentUserResponse> GetCurrentUserAsync(
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(currentUser.UserId, cancellationToken)
            ?? throw new UnauthorizedException("The signed-in user no longer exists.");

        var clientId = user.Role == UserRole.Client
            ? (await _clientRepository.GetByUserIdAsync(user.Id, cancellationToken))?.Id
            : null;

        return new CurrentUserResponse(
            user.Id,
            user.Email,
            user.FullName,
            user.Role.ToString(),
            clientId,
            user.Role == UserRole.Driver ? user.Availability.ToString() : null);
    }

    private async Task<AuthResponse> CreateAuthResponseAsync(User user, CancellationToken cancellationToken)
    {
        var clientId = user.Role == UserRole.Client
            ? (await _clientRepository.GetByUserIdAsync(user.Id, cancellationToken))?.Id
            : null;

        return CreateAuthResponse(user, clientId);
    }

    private AuthResponse CreateAuthResponse(User user, int? clientId)
    {
        var token = _tokenService.CreateToken(user);

        return new AuthResponse(
            user.Id,
            user.Email,
            user.FullName,
            user.Role.ToString(),
            token.Token,
            token.ExpiresAtUtc,
            clientId);
    }

    private async Task EnsureEmailIsFreeAsync(string email, CancellationToken cancellationToken)
    {
        if (await _userRepository.EmailExistsAsync(email, cancellationToken))
        {
            throw new ConflictException("An account with this email address already exists.");
        }
    }

    private static string Normalize(string email) => email.Trim().ToLowerInvariant();

    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
