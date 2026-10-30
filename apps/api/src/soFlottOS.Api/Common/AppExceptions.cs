namespace soFlottOS.Api.Common;

// ---------------------------------------------------------------------------
// Business errors. Services throw these; ApiExceptionHandler turns them into the
// right HTTP status code. This keeps controllers free of try/catch blocks.
// ---------------------------------------------------------------------------

/// <summary>Base class for every expected (non-bug) error.</summary>
public abstract class AppException(string message) : Exception(message);

/// <summary>400 - the request body does not make sense.</summary>
public sealed class ValidationException : AppException
{
    public ValidationException(string message)
        : base(message)
    {
    }

    public ValidationException(string field, string message)
        : base(message)
    {
        Errors[field] = [message];
    }

    /// <summary>Field name -> error messages, rendered as an RFC 7807 validation problem.</summary>
    public Dictionary<string, string[]> Errors { get; } = new(StringComparer.OrdinalIgnoreCase);
}

/// <summary>401 - the caller is not signed in (or the credentials are wrong).</summary>
public sealed class UnauthorizedException(string message) : AppException(message);

/// <summary>403 - the caller is signed in but may not touch this resource.</summary>
public sealed class ForbiddenException(string message) : AppException(message);

/// <summary>404 - the resource does not exist.</summary>
public sealed class NotFoundException(string message) : AppException(message);

/// <summary>409 - the action is not allowed in the current state (e.g. delivering a cancelled order).</summary>
public sealed class ConflictException(string message) : AppException(message);

/// <summary>502 - a third party service (routing, SMS) failed.</summary>
public sealed class ExternalServiceException(string message) : AppException(message);
