using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Caching.Memory;
using soFlottOS.Api.Common;

namespace soFlottOS.Api.Services;

/// <summary>A postal address resolved to a point on the map.</summary>
public sealed record GeocodedAddress(decimal Lat, decimal Lng, string Label, string Source);

public interface IGeocodingService
{
    /// <summary>Turns a free-text postal address into coordinates.</summary>
    Task<GeocodedAddress> GeocodeAsync(string address, CancellationToken cancellationToken = default);
}

/// <summary>
/// Turns the addresses typed in the booking form into coordinates so the distance can be
/// calculated automatically - clients never have to know a latitude or a longitude.
/// <list type="bullet">
/// <item>OpenRouteService (Pelias) when Routing:ApiKey is configured.</item>
/// <item>Nominatim (OpenStreetMap) otherwise - free and key-less, ideal for development.</item>
/// </list>
/// Results are cached for a day because the same pickup depot is booked over and over and both
/// providers enforce strict fair-use rate limits.
/// </summary>
public sealed class GeocodingService(HttpClient httpClient, RoutingOptions options, IMemoryCache cache) : IGeocodingService
{
    private static readonly TimeSpan CacheLifetime = TimeSpan.FromHours(24);

    private readonly HttpClient _httpClient = httpClient;
    private readonly RoutingOptions _options = options;
    private readonly IMemoryCache _cache = cache;

    public async Task<GeocodedAddress> GeocodeAsync(string address, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(address))
            throw new ValidationException("An address is required to calculate the distance.");

        var query = address.Trim();
        var cacheKey = $"geocode:{_options.Provider}:{_options.CountryCode}:{query.ToLowerInvariant()}";
        if (_cache.TryGetValue<GeocodedAddress>(cacheKey, out var cached) && cached is not null)
            return cached;

        var resolved = _options.UseOpenRouteServiceGeocoding
            ? await SearchOpenRouteServiceAsync(query, cancellationToken)
            : await SearchNominatimAsync(query, cancellationToken);

        _cache.Set(cacheKey, resolved, CacheLifetime);
        return resolved;
    }

    /// <summary>OpenRouteService geocoding is Pelias: /geocode/search returns GeoJSON features.</summary>
    private async Task<GeocodedAddress> SearchOpenRouteServiceAsync(string address, CancellationToken cancellationToken)
    {
        var url = $"{_options.BaseUrl.TrimEnd('/')}/geocode/search" +
                  $"?api_key={Uri.EscapeDataString(_options.ApiKey!)}" +
                  $"&text={Uri.EscapeDataString(address)}" +
                  $"&boundary.country={Uri.EscapeDataString(_options.CountryCode)}" +
                  "&size=1";

        using var response = await _httpClient.GetAsync(url, cancellationToken);
        await EnsureSuccessAsync(response, "OpenRouteService geocoding", cancellationToken);

        var payload = await response.Content.ReadFromJsonAsync<PeliasResponse>(cancellationToken);
        var feature = payload?.Features?.FirstOrDefault();
        var coordinates = feature?.Geometry?.Coordinates;
        if (coordinates is not { Count: >= 2 })
            throw new ValidationException($"No location could be found for '{address}'. Please check the address.");

        // Pelias, like the rest of GeoJSON, orders coordinates as [longitude, latitude].
        return new GeocodedAddress(
            coordinates[1],
            coordinates[0],
            string.IsNullOrWhiteSpace(feature!.Properties?.Label) ? address : feature.Properties!.Label!,
            "OpenRouteService");
    }

    /// <summary>Nominatim needs no key but demands an identifying User-Agent and at most one call per second.</summary>
    private async Task<GeocodedAddress> SearchNominatimAsync(string address, CancellationToken cancellationToken)
    {
        var url = $"{_options.GeocodingUrl.TrimEnd('/')}/search" +
                  $"?q={Uri.EscapeDataString(address)}" +
                  $"&countrycodes={Uri.EscapeDataString(_options.CountryCode.ToLowerInvariant())}" +
                  "&format=jsonv2&addressdetails=0&limit=1";

        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.TryAddWithoutValidation("User-Agent", _options.UserAgent);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        await EnsureSuccessAsync(response, "Nominatim geocoding", cancellationToken);

        var results = await response.Content.ReadFromJsonAsync<IReadOnlyList<NominatimResult>>(cancellationToken);
        var match = results?.FirstOrDefault();
        if (match is null ||
            !decimal.TryParse(match.Lat, NumberStyles.Float, CultureInfo.InvariantCulture, out var lat) ||
            !decimal.TryParse(match.Lon, NumberStyles.Float, CultureInfo.InvariantCulture, out var lng))
            throw new ValidationException($"No location could be found for '{address}'. Please check the address.");

        return new GeocodedAddress(lat, lng, string.IsNullOrWhiteSpace(match.DisplayName) ? address : match.DisplayName!, "Nominatim");
    }

    private static async Task EnsureSuccessAsync(HttpResponseMessage response, string provider, CancellationToken cancellationToken)
    {
        if (response.IsSuccessStatusCode)
            return;

        var error = await response.Content.ReadAsStringAsync(cancellationToken);
        throw new ExternalServiceException($"{provider} failed with status {(int)response.StatusCode}: {error}");
    }

    private sealed record PeliasResponse(
        [property: JsonPropertyName("features")] IReadOnlyList<PeliasFeature>? Features);

    private sealed record PeliasFeature(
        [property: JsonPropertyName("geometry")] PeliasGeometry? Geometry,
        [property: JsonPropertyName("properties")] PeliasProperties? Properties);

    private sealed record PeliasGeometry(
        [property: JsonPropertyName("coordinates")] IReadOnlyList<decimal>? Coordinates);

    private sealed record PeliasProperties(
        [property: JsonPropertyName("label")] string? Label);

    private sealed record NominatimResult(
        [property: JsonPropertyName("lat")] string? Lat,
        [property: JsonPropertyName("lon")] string? Lon,
        [property: JsonPropertyName("display_name")] string? DisplayName);
}
