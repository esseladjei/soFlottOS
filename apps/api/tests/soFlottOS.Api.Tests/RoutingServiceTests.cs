using System.Net;
using System.Text;
using System.Text.Json;
using soFlottOS.Api.Common;
using soFlottOS.Api.Services;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class RoutingServiceTests
{
    private static RoutingService CreateService() => new(new HttpClient(), new RoutingOptions());

    [Fact]
    public async Task GetRouteAsync_ReturnsAddressOnlyQuoteWhenCoordinatesAreOmitted()
    {
        var quote = await CreateService().GetRouteAsync(new RouteRequest(null, null, null, null));

        Assert.Equal(0m, quote.DistanceKm);
        Assert.Equal(0, quote.EstimatedDurationMinutes);
        Assert.Equal("AddressOnly", quote.Source);
        Assert.Empty(quote.Geometry);
    }

    [Fact]
    public async Task GetRouteAsync_ReturnsADrawablePathBetweenBothPoints()
    {
        var quote = await CreateService().GetRouteAsync(new RouteRequest(48.1372m, 11.5756m, 48.7758m, 9.1829m));

        Assert.True(quote.DistanceKm > 0m);
        Assert.True(quote.EstimatedDurationMinutes > 0);
        Assert.Collection(
            quote.Geometry,
            start => Assert.Equal((48.1372m, 11.5756m), (start.Lat, start.Lng)),
            end => Assert.Equal((48.7758m, 9.1829m), (end.Lat, end.Lng)));
    }

    [Fact]
    public async Task GetRouteAsync_RejectsPartialCoordinates()
    {
        await Assert.ThrowsAsync<ValidationException>(() =>
            CreateService().GetRouteAsync(new RouteRequest(48.1m, 11.5m, null, null)));
    }

    [Fact]
    public async Task GetRouteAsync_SendsLongitudeLatitudePairsToTheDrivingCarProfile()
    {
        var handler = new CapturingHandler(DirectionsResponse(56967.5m, 2976.2m));
        var service = OpenRouteServiceWith(handler);

        await service.GetRouteAsync(new RouteRequest(48.2519m, 11.5556m, 48.2347m, 10.9803m));

        Assert.Equal("/v2/directions/driving-car/geojson", handler.Path);

        var coordinates = JsonDocument.Parse(handler.Body!).RootElement.GetProperty("coordinates");
        Assert.Equal(11.5556m, coordinates[0][0].GetDecimal());
        Assert.Equal(48.2519m, coordinates[0][1].GetDecimal());
        Assert.Equal(10.9803m, coordinates[1][0].GetDecimal());
        Assert.Equal(48.2347m, coordinates[1][1].GetDecimal());
    }

    [Fact]
    public async Task GetRouteAsync_ConvertsDrivingMetresToKilometresAndSecondsToMinutes()
    {
        var service = OpenRouteServiceWith(new CapturingHandler(DirectionsResponse(56967.5m, 2976.2m)));

        var quote = await service.GetRouteAsync(new RouteRequest(48.2519m, 11.5556m, 48.2347m, 10.9803m));

        Assert.Equal(56.97m, quote.DistanceKm);
        Assert.Equal(50, quote.EstimatedDurationMinutes);
        Assert.Equal("OpenRouteService", quote.Source);
        // The returned path carries every shape point, so the map draws roads instead of a straight line.
        Assert.Equal(3, quote.Geometry.Count);
        Assert.Equal((48.2519m, 11.5556m), (quote.Geometry[0].Lat, quote.Geometry[0].Lng));
    }

    [Fact]
    public async Task GetRouteAsync_SendsTheApiKeyEvenWhenItIsNotAValidSchemeParameterPair()
    {
        // Real OpenRouteService keys are base64-ish tokens ending in '=', which strict header validation rejects.
        var handler = new CapturingHandler(DirectionsResponse(56967.5m, 2976.2m));
        var service = new RoutingService(
            new HttpClient(handler) { BaseAddress = new Uri("https://api.openrouteservice.org") },
            new RoutingOptions { Provider = RoutingProvider.OpenRouteService, ApiKey = "eyJhbGciOiJIUzI1NiJ9=" });

        await service.GetRouteAsync(new RouteRequest(48.2519m, 11.5556m, 48.2347m, 10.9803m));

        Assert.Equal("eyJhbGciOiJIUzI1NiJ9=", handler.Authorization);
    }

    private static RoutingService OpenRouteServiceWith(CapturingHandler handler) =>
        new(new HttpClient(handler) { BaseAddress = new Uri("https://api.openrouteservice.org") },
            new RoutingOptions { Provider = RoutingProvider.OpenRouteService, ApiKey = "test-key" });

    private static string DirectionsResponse(decimal distanceMetres, decimal durationSeconds) =>
        FormattableString.Invariant($$"""
          {
            "features": [{
              "properties": { "summary": { "distance": {{distanceMetres}}, "duration": {{durationSeconds}} } },
              "geometry": { "coordinates": [[11.5556, 48.2519], [11.2, 48.24], [10.9803, 48.2347]] }
            }]
          }
          """);

    private sealed class CapturingHandler(string response) : HttpMessageHandler
    {
        public string? Body { get; private set; }

        public string? Path { get; private set; }

        public string? Authorization { get; private set; }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Path = request.RequestUri!.AbsolutePath;
            Authorization = request.Headers.TryGetValues("Authorization", out var values) ? values.Single() : null;
            Body = request.Content is null ? null : await request.Content.ReadAsStringAsync(cancellationToken);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(response, Encoding.UTF8, "application/json")
            };
        }
    }
}
