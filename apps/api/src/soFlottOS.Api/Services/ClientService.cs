using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Email;

namespace soFlottOS.Api.Services;

public interface IClientService
{
    Task<IReadOnlyList<ClientSummaryResponse>> ListAsync(CancellationToken cancellationToken = default);

    Task<ClientDetailResponse> GetAsync(int id, CurrentUser currentUser, CancellationToken cancellationToken = default);

    Task<ClientDetailResponse> GetMineAsync(CurrentUser currentUser, CancellationToken cancellationToken = default);

    Task<ClientDetailResponse> CreateAsync(SaveClientRequest request, CancellationToken cancellationToken = default);

    Task<ClientDetailResponse> UpdateAsync(int id, SaveClientRequest request, CurrentUser currentUser, CancellationToken cancellationToken = default);
}

/// <summary>
/// The CRM module: create, read and update business customers.
/// Access rule: admins see every client, a client only sees its own record.
/// </summary>
public sealed class ClientService(IClientRepository clientRepository, IEmailCommunications emails) : IClientService
{
    private readonly IClientRepository _clientRepository = clientRepository;

    public async Task<IReadOnlyList<ClientSummaryResponse>> ListAsync(CancellationToken cancellationToken = default)
    {
        var clients = await _clientRepository.ListAsync(cancellationToken);
        return clients.Select(client => client.ToSummary()).ToArray();
    }

    public async Task<ClientDetailResponse> GetAsync(
        int id,
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        var client = await _clientRepository.GetByIdAsync(id, includeOrders: true, cancellationToken)
            ?? throw new NotFoundException($"Client {id} was not found.");

        EnsureAccess(client, currentUser);

        return client.ToDetail();
    }

    /// <summary>Convenience endpoint for the client portal: "my own company profile".</summary>
    public async Task<ClientDetailResponse> GetMineAsync(CurrentUser currentUser, CancellationToken cancellationToken = default)
    {
        var client = await _clientRepository.GetByUserIdAsync(currentUser.UserId, cancellationToken)
            ?? throw new NotFoundException("This login is not linked to a client profile yet.");

        return client.ToDetail();
    }

    /// <summary>Manual onboarding by an admin (e.g. after a flyer drop). No login account is created.</summary>
    public async Task<ClientDetailResponse> CreateAsync(SaveClientRequest request, CancellationToken cancellationToken = default)
    {
        var client = new Client();
        Apply(request, client);

        emails.ClientOnboarded(client);
        await _clientRepository.AddAsync(client, cancellationToken);

        return client.ToDetail();
    }

    public async Task<ClientDetailResponse> UpdateAsync(
        int id,
        SaveClientRequest request,
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        var client = await _clientRepository.GetByIdAsync(id, includeOrders: true, cancellationToken)
            ?? throw new NotFoundException($"Client {id} was not found.");

        EnsureAccess(client, currentUser);

        // Negotiated rates are an admin-only lever, so remember them before applying
        // the request and put them back when a client edits its own profile.
        var currentBaseFee = client.DefaultBaseFee;
        var currentRatePerKilometer = client.DefaultRatePerKilometer;

        Apply(request, client);

        if (!currentUser.IsAdmin)
        {
            client.DefaultBaseFee = currentBaseFee;
            client.DefaultRatePerKilometer = currentRatePerKilometer;
        }

        await _clientRepository.SaveChangesAsync(cancellationToken);

        return client.ToDetail();
    }

    private static void Apply(SaveClientRequest request, Client client)
    {
        client.CompanyName = request.CompanyName.Trim();
        client.ContactPerson = request.ContactPerson.Trim();
        client.Email = request.Email.Trim().ToLowerInvariant();
        client.Phone = request.Phone.Trim();
        client.Street = request.Street.Trim();
        client.City = request.City.Trim();
        client.PostalCode = request.PostalCode.Trim();
        client.Country = request.Country.Trim();
        client.TaxIdNumber = Clean(request.TaxIdNumber);
        client.SpecialDeliveryInstructions = Clean(request.SpecialDeliveryInstructions);
        client.DefaultBaseFee = request.DefaultBaseFee;
        client.DefaultRatePerKilometer = request.DefaultRatePerKilometer;
    }

    private static void EnsureAccess(Client client, CurrentUser currentUser)
    {
        if (currentUser.IsAdmin)
        {
            return;
        }

        if (!currentUser.IsClient || client.UserId != currentUser.UserId)
        {
            throw new ForbiddenException("You may only access your own client profile.");
        }
    }

    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
