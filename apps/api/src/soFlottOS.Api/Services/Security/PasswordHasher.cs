using System.Text;

namespace soFlottOS.Api.Services.Security;

/// <summary>Hashes and verifies passwords. Implemented with BCrypt.</summary>
public interface IPasswordHasher
{
    string Hash(string password);

    bool Verify(string password, string passwordHash);
}

/// <summary>
/// BCrypt automatically salts every hash and is deliberately slow, which makes
/// stolen password hashes expensive to crack.
/// </summary>
public sealed class BCryptPasswordHasher : IPasswordHasher
{
    public string Hash(string password)
    {
        PasswordPolicy.Validate(password);
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool Verify(string password, string passwordHash) =>
        Encoding.UTF8.GetByteCount(password) <= 72 && BCrypt.Net.BCrypt.Verify(password, passwordHash);
}
