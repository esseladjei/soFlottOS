using System.Net;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using soFlottOS.Api.Common;
using soFlottOS.Api.Services;
using Xunit;

namespace soFlottOS.Api.Tests;

/// <summary>
/// Covers the address lookup that replaced the manual latitude/longitude fields: both providers
/// must be parsed correctly (GeoJSON is [lng, lat]) and repeat lookups must hit the cache.
/// </summary>
public sealed class GeocodingServiceTests
{
    private const string NominatimPayload = """
        [{"lat":"48.1374990","lon":"11.5747545","display_name":"Marienplatz 1, München, 80331, Deutschland"}]
        """;

    private const string PeliasPayload = """
        {"features":[{"geometry":{"coordinates":[11.5747545,48.1374990]},"properties":{"label":"Marienplatz 1, München"}}]}
        """;

    [Fact]
    public async Task GeocodeAsync_ReadsNominatimResultsWhenNoApiKeyIsConfigured()
    {
        var handler = new StubHandler(NominatimPayload);
        var service = Create(handler, new RoutingOptions());

        var result = await service.GeocodeAsync("Marienplatz 1, 80331 München");

        Assert.Equal(48.1374990m, result.Lat);
        Assert.Equal(11.5747545m, result.Lng);
        Assert.Equal("Marienplatz 1, München, 80331, Deutschland", result.Label);
        Assert.Equal("Nominatim", result.Source);
        Assert.Contains("nominatim.openstreetmap.org", handler.LastUrl);
    }

    [Fact]
    public async Task GeocodeAsync_ReadsOpenRouteServiceResultsWhenAnApiKeyIsConfigured()
    {
        var handler = new StubHandler(PeliasPayload);
        var service = Create(handler, new RoutingOptions { Provider = RoutingProvider.OpenRouteService, ApiKey = "test-key" });

        var result = await service.GeocodeAsync("Marienplatz 1, 80331 München");

        // GeoJSON orders coordinates as [longitude, latitude]; they must come back the other way round.
        Assert.Equal(48.1374990m, result.Lat);
        Assert.Equal(11.5747545m, result.Lng);
        Assert.Equal("OpenRouteService", result.Source);
        Assert.Contains("/geocode/search", handler.LastUrl);
    }

    [Fact]
    public async Task GeocodeAsync_CachesRepeatedLookupsToRespectFairUseLimits()
    {
        var handler = new StubHandler(NominatimPayload);
        var service = Create(handler, new RoutingOptions());

        await service.GeocodeAsync("Marienplatz 1, 80331 München");
        await service.GeocodeAsync("marienplatz 1, 80331 münchen");

        Assert.Equal(1, handler.Calls);
    }

    [Fact]
    public async Task GeocodeAsync_RejectsABlankAddress() =>
        await Assert.ThrowsAsync<ValidationException>(() =>
            Create(new StubHandler(NominatimPayload), new RoutingOptions()).GeocodeAsync("  "));

    [Fact]
    public async Task GeocodeAsync_ReportsAnAddressThatCannotBeFound() =>
        await Assert.ThrowsAsync<ValidationException>(() =>
            Create(new StubHandler("[]"), new RoutingOptions()).GeocodeAsync("Nowhere at all"));

    [Fact]
    public async Task GeocodeAsync_SurfacesProviderFailures() =>
        await Assert.ThrowsAsync<ExternalServiceException>(() =>
            Create(new StubHandler("rate limited", HttpStatusCode.TooManyRequests), new RoutingOptions())
                .GeocodeAsync("Marienplatz 1, 80331 München"));

    private static GeocodingService Create(StubHandler handler, RoutingOptions options) =>
        new(new HttpClient(handler), options, new MemoryCache(new MemoryCacheOptions()));

    private sealed class StubHandler(string payload, HttpStatusCode status = HttpStatusCode.OK) : HttpMessageHandler
    {
        public int Calls { get; private set; }
        public string LastUrl { get; private set; } = string.Empty;

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Calls++;
            LastUrl = request.RequestUri!.ToString();
            return Task.FromResult(new HttpResponseMessage(status)
            {
                Content = new StringContent(payload, Encoding.UTF8, "application/json"),
            });
        }
    }
}
