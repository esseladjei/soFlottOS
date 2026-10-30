using System.Net.Http.Json;
using System.Text.Json.Serialization;
using soFlottOS.Api.Common;

namespace soFlottOS.Api.Services;

/// <summary>Two coordinates to route between.</summary>
public sealed record RouteRequest(decimal? PickupLat, decimal? PickupLng, decimal? DropoffLat, decimal? DropoffLng);

/// <summary>One point of the driven path, ready to be drawn on a map.</summary>
public sealed record RoutePoint(decimal Lat, decimal Lng);

/// <summary>Distance, driving time and the path to draw, plus which provider produced them.</summary>
public sealed record RouteQuote(
    decimal DistanceKm,
    int EstimatedDurationMinutes,
    string Source,
    IReadOnlyList<RoutePoint> Geometry);

public interface IRoutingService
{
    Task<RouteQuote> GetRouteAsync(RouteRequest request, CancellationToken cancellationToken = default);
}

/// <summary>
/// Works out how far a delivery is.
/// <list type="bullet">
/// <item>GeoDistance: straight-line maths, no API key, perfect for local development.</item>
/// <item>OpenRouteService: real driving distance from openrouteservice.org (set Routing:ApiKey).</item>
/// </list>
/// Both providers return a geometry so the booking form can draw the route from A to B.
/// </summary>
public sealed class RoutingService(HttpClient httpClient, RoutingOptions options) : IRoutingService
{
    private const double EarthRadiusKm = 6371d;

    private readonly HttpClient _httpClient = httpClient;
    private readonly RoutingOptions _options = options;

    public Task<RouteQuote> GetRouteAsync(RouteRequest request, CancellationToken cancellationToken = default)
    {
        var coordinates = new[] { request.PickupLat, request.PickupLng, request.DropoffLat, request.DropoffLng };
        if (coordinates.Any(value => value.HasValue) && coordinates.Any(value => !value.HasValue))
            throw new ValidationException("Coordinates must be supplied for both addresses or omitted entirely.");

        if (coordinates.All(value => !value.HasValue))
            return Task.FromResult(new RouteQuote(0, 0, "AddressOnly", []));

        return _options.Provider switch
        {
            RoutingProvider.GeoDistance => Task.FromResult(CalculateStraightLine(request)),
            RoutingProvider.OpenRouteService => CallOpenRouteServiceAsync(request, cancellationToken),
            _ => throw new InvalidOperationException($"Routing provider '{_options.Provider}' is not supported.")
        };
    }

    /// <summary>Haversine formula: the distance over the surface of the earth between two points.</summary>
    private RouteQuote CalculateStraightLine(RouteRequest request)
    {
        var lat1 = ToRadians((double)request.PickupLat!.Value);
        var lon1 = ToRadians((double)request.PickupLng!.Value);
        var lat2 = ToRadians((double)request.DropoffLat!.Value);
        var lon2 = ToRadians((double)request.DropoffLng!.Value);

        var deltaLat = lat2 - lat1;
        var deltaLon = lon2 - lon1;

        var a = Math.Pow(Math.Sin(deltaLat / 2), 2) +
                (Math.Cos(lat1) * Math.Cos(lat2) * Math.Pow(Math.Sin(deltaLon / 2), 2));
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        var distanceKm = decimal.Round((decimal)(EarthRadiusKm * c), 2, MidpointRounding.AwayFromZero);
        var durationMinutes = EstimateDuration(distanceKm);

        // Without a routing provider the best path we can draw is the direct line between both points.
        RoutePoint[] geometry =
        [
            new(request.PickupLat!.Value, request.PickupLng!.Value),
            new(request.DropoffLat!.Value, request.DropoffLng!.Value)
        ];

        return new RouteQuote(distanceKm, durationMinutes, RoutingProvider.GeoDistance.ToString(), geometry);
    }

    private async Task<RouteQuote> CallOpenRouteServiceAsync(RouteRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new ExternalServiceException("Routing:ApiKey must be configured to use OpenRouteService.");
        }

        // The GeoJSON variant returns the full path as plain coordinates, no polyline decoding needed.
        using var message = new HttpRequestMessage(HttpMethod.Post, "/v2/directions/driving-car/geojson");
        // ORS keys are raw tokens, not a "scheme parameter" pair, so strict header validation rejects them.
        message.Headers.TryAddWithoutValidation("Authorization", _options.ApiKey);
        message.Content = JsonContent.Create(new
        {
            // OpenRouteService expects [longitude, latitude] pairs.
            coordinates = new[]
            {
                new[] { request.PickupLng!.Value, request.PickupLat!.Value },
                new[] { request.DropoffLng!.Value, request.DropoffLat!.Value }
            }
        });

        using var response = await _httpClient.SendAsync(message, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new ExternalServiceException($"OpenRouteService failed with status {(int)response.StatusCode}: {error}");
        }

        var payload = await response.Content.ReadFromJsonAsync<OpenRouteServiceResponse>(cancellationToken);
        var feature = payload?.Features?.FirstOrDefault();
        var summary = feature?.Properties?.Summary
            ?? throw new ExternalServiceException("OpenRouteService returned an unexpected response.");

        var distanceKm = decimal.Round(summary.Distance / 1000m, 2, MidpointRounding.AwayFromZero);
        var durationMinutes = Math.Max(1, (int)Math.Ceiling(summary.Duration / 60m));
        var geometry = (feature!.Geometry?.Coordinates ?? [])
            .Where(pair => pair.Count >= 2)
            .Select(pair => new RoutePoint(pair[1], pair[0]))
            .ToArray();

        return new RouteQuote(distanceKm, durationMinutes, RoutingProvider.OpenRouteService.ToString(), geometry);
    }

    private int EstimateDuration(decimal distanceKm) =>
        Math.Max(1, (int)Math.Ceiling((double)distanceKm / (double)_options.AverageSpeedKph * 60));

    private static double ToRadians(double degrees) => degrees * Math.PI / 180d;

    // Minimal shapes of the OpenRouteService GeoJSON response.
    private sealed record OpenRouteServiceResponse(
        [property: JsonPropertyName("features")] IReadOnlyList<OpenRouteServiceFeature>? Features);

    private sealed record OpenRouteServiceFeature(
        [property: JsonPropertyName("properties")] OpenRouteServiceProperties? Properties,
        [property: JsonPropertyName("geometry")] OpenRouteServiceGeometry? Geometry);

    private sealed record OpenRouteServiceProperties(
        [property: JsonPropertyName("summary")] OpenRouteServiceSummary? Summary);

    private sealed record OpenRouteServiceGeometry(
        [property: JsonPropertyName("coordinates")] IReadOnlyList<IReadOnlyList<decimal>>? Coordinates);

    private sealed record OpenRouteServiceSummary(
        [property: JsonPropertyName("distance")] decimal Distance,
        [property: JsonPropertyName("duration")] decimal Duration);
}
