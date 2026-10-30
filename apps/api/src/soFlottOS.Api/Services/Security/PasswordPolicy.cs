using System.ComponentModel.DataAnnotations;
using System.Text;

namespace soFlottOS.Api.Services.Security;

public static class PasswordPolicy
{
    public const string Message = "Use at least 12 characters with uppercase (A-Z) and lowercase (a-z) letters, a digit and an ASCII symbol, no whitespace, and at most 72 UTF-8 bytes.";

    public static bool IsValid(string? password) =>
        password is { Length: >= 12 and <= 72 } &&
        Encoding.UTF8.GetByteCount(password) <= 72 &&
        password.Any(c => c is >= 'A' and <= 'Z') &&
        password.Any(c => c is >= 'a' and <= 'z') &&
        password.Any(c => c is >= '0' and <= '9') &&
        password.Any(c => c is >= '!' and <= '/' or >= ':' and <= '@' or >= '[' and <= '`' or >= '{' and <= '~') &&
        !password.Any(c => char.IsWhiteSpace(c) || c == '\uFEFF');

    public static void Validate(string password)
    {
        if (!IsValid(password))
            throw new Common.ValidationException("Password", Message);
    }
}

[AttributeUsage(AttributeTargets.Property)]
public sealed class StrongPasswordAttribute : ValidationAttribute
{
    public StrongPasswordAttribute() : base(PasswordPolicy.Message) { }
    public override bool IsValid(object? value) => value is string password && PasswordPolicy.IsValid(password);
}
