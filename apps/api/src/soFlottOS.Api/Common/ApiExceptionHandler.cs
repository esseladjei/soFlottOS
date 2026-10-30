using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace soFlottOS.Api.Common;

/// <summary>
/// Single place where exceptions become HTTP responses.
/// Every error leaves the API in the same RFC 7807 "problem details" shape
/// ({ title, detail, status, traceId, errors? }) which the frontend knows how to display.
/// </summary>
public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    private readonly ILogger<ApiExceptionHandler> _logger = logger;

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var problemDetails = exception switch
        {
            ValidationException { Errors.Count: > 0 } validation => CreateValidationProblem(httpContext, validation),
            ValidationException validation => CreateProblem(httpContext, StatusCodes.Status400BadRequest, validation.Message),
            UnauthorizedException unauthorized => CreateProblem(httpContext, StatusCodes.Status401Unauthorized, unauthorized.Message),
            ForbiddenException forbidden => CreateProblem(httpContext, StatusCodes.Status403Forbidden, forbidden.Message),
            NotFoundException notFound => CreateProblem(httpContext, StatusCodes.Status404NotFound, notFound.Message),
            ConflictException conflict => CreateProblem(httpContext, StatusCodes.Status409Conflict, conflict.Message),
            ExternalServiceException external => CreateProblem(httpContext, StatusCodes.Status502BadGateway, external.Message),

            // Anything else is a bug: never leak the exception message to the caller.
            _ => CreateProblem(httpContext, StatusCodes.Status500InternalServerError, "An unexpected server error occurred.")
        };

        if (problemDetails.Status >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Request {Path} failed with {StatusCode}.", httpContext.Request.Path, problemDetails.Status);
        }
        else
        {
            _logger.LogWarning("Request {Path} rejected with {StatusCode}: {Message}", httpContext.Request.Path, problemDetails.Status, exception.Message);
        }

        httpContext.Response.StatusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }

    private static ProblemDetails CreateProblem(HttpContext context, int statusCode, string detail) =>
        Decorate(
            new ProblemDetails
            {
                Status = statusCode,
                Title = ReasonPhrases.GetReasonPhrase(statusCode),
                Detail = detail
            },
            context);

    private static ValidationProblemDetails CreateValidationProblem(HttpContext context, ValidationException exception) =>
        Decorate(
            new ValidationProblemDetails(exception.Errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation failed.",
                Detail = exception.Message
            },
            context);

    private static T Decorate<T>(T problemDetails, HttpContext context)
        where T : ProblemDetails
    {
        problemDetails.Instance = context.Request.Path;
        problemDetails.Extensions["traceId"] = context.TraceIdentifier;
        return problemDetails;
    }
}
