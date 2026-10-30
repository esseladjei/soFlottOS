using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using soFlottOS.Api.Services.Email;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class ResendEmailSenderTests
{
    private static readonly EmailContent Content = new("Subject", "<p>HTML</p>", "Text",
        [new EmailAttachment("invoice.html", "Ym9keQ==", "text/html")]);

    [Fact]
    public async Task Send_UsesResendContractAndStableIdempotencyKey()
    {
        using var handler = new StubHandler(async (request, _) =>
        {
            Assert.Equal("https://api.resend.com/emails", request.RequestUri!.ToString());
            Assert.Equal(HttpMethod.Post, request.Method);
            Assert.Equal("Bearer test-key", request.Headers.Authorization!.ToString());
            Assert.Equal("same-key", Assert.Single(request.Headers.GetValues("Idempotency-Key")));
            using var payload = JsonDocument.Parse(await request.Content!.ReadAsStringAsync());
            var body = payload.RootElement;
            Assert.Equal("recipient@example.com", body.GetProperty("to")[0].GetString());
            Assert.Equal("soFlott <notifications@example.com>", body.GetProperty("from").GetString());
            Assert.Equal("support@example.com", body.GetProperty("reply_to").GetString());
            Assert.Equal("text/html", body.GetProperty("attachments")[0].GetProperty("content_type").GetString());
            Assert.Equal(Content.Text, body.GetProperty("text").GetString());
            return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent("{\"id\":\"resend-id\"}") };
        });
        using var client = Client(handler);
        Assert.Equal("resend-id", await new ResendEmailSender(client, EmailSamples.Options())
            .SendAsync(Content, "recipient@example.com", "same-key"));
    }

    [Theory]
    [InlineData(400, false)]
    [InlineData(401, false)]
    [InlineData(403, false)]
    [InlineData(422, false)]
    [InlineData(408, true)]
    [InlineData(429, true)]
    [InlineData(500, true)]
    [InlineData(503, true)]
    public async Task Send_ClassifiesErrorsAndDoesNotExposeProviderBody(int status, bool transient)
    {
        using var handler = new StubHandler((_, _) =>
        {
            var response = new HttpResponseMessage((HttpStatusCode)status) { Content = new StringContent("secret customer data") };
            response.Headers.RetryAfter = new RetryConditionHeaderValue(TimeSpan.FromSeconds(120));
            return Task.FromResult(response);
        });
        using var client = Client(handler);
        var exception = await Assert.ThrowsAsync<EmailDeliveryException>(() =>
            new ResendEmailSender(client, EmailSamples.Options()).SendAsync(Content, "recipient@example.com", "key"));
        Assert.Equal(transient, exception.IsTransient);
        Assert.Equal(TimeSpan.FromSeconds(120), exception.RetryAfter);
        Assert.DoesNotContain("secret", exception.Message);
    }

    [Theory]
    [InlineData("{}")]
    [InlineData("{\"id\":null}")]
    [InlineData("{\"id\":123}")]
    [InlineData("not-json")]
    public async Task InvalidSuccessResponse_IsExplicitAndRetryable(string body)
    {
        using var handler = new StubHandler((_, _) =>
            Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(body) }));
        using var client = Client(handler);
        var exception = await Assert.ThrowsAsync<EmailDeliveryException>(() =>
            new ResendEmailSender(client, EmailSamples.Options()).SendAsync(Content, "recipient@example.com", "key"));
        Assert.True(exception.IsTransient);
    }

    [Fact]
    public async Task NetworkErrorsAreRetryableAndCallerCancellationIsPreserved()
    {
        using var handler = new StubHandler((_, cancellationToken) =>
        {
            cancellationToken.ThrowIfCancellationRequested();
            throw new HttpRequestException("network secret");
        });
        using var client = Client(handler);
        var sender = new ResendEmailSender(client, EmailSamples.Options());
        Assert.True((await Assert.ThrowsAsync<EmailDeliveryException>(() => sender.SendAsync(Content, "recipient@example.com", "key"))).IsTransient);
        using var cancelled = new CancellationTokenSource();
        cancelled.Cancel();
        await Assert.ThrowsAnyAsync<OperationCanceledException>(() => sender.SendAsync(Content, "recipient@example.com", "key", cancelled.Token));
    }

    private static HttpClient Client(HttpMessageHandler handler) => new(handler) { BaseAddress = new Uri("https://api.resend.com/") };
    private sealed class StubHandler(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> send) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) => send(request, cancellationToken);
    }
}
