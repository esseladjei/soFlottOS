using System.ComponentModel.DataAnnotations;
using System.Text;
using soFlottOS.Api.Common;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Security;
using Xunit;
using ValidationException = soFlottOS.Api.Common.ValidationException;

namespace soFlottOS.Api.Tests;

public sealed class PasswordPolicyTests
{
    [Theory]
    [InlineData("Short1!")]
    [InlineData("lowercase123!")]
    [InlineData("UPPERCASE123!")]
    [InlineData("NoDigitsHere!")]
    [InlineData("NoSymbols1234")]
    [InlineData("Has Spaces123!")]
    [InlineData("Has\tTabs123!")]
    [InlineData("Has\u0085Space123!")]
    [InlineData("Has\uFEFFSpace123!")]
    [InlineData("UnicodeSymbol123€")]
    public void RejectsWeakPasswordsAtHashAndDtoBoundaries(string password)
    {
        Assert.False(PasswordPolicy.IsValid(password));
        Assert.Throws<ValidationException>(() => new BCryptPasswordHasher().Hash(password));
        var seedError = Assert.Throws<InvalidOperationException>(() =>
            new SeedOptions { Enabled = true, DefaultPassword = password }.Validate());
        Assert.Contains("Seed:DefaultPassword", seedError.Message);
        var requests = new object[]
        {
            new RegisterClientRequest { Password = password },
            new RegisterDriverRequest { Password = password },
            new ResetPasswordRequest { Password = password }
        };
        foreach (var request in requests)
        {
            var results = new List<ValidationResult>();
            Validator.TryValidateObject(request, new ValidationContext(request), results, true);
            Assert.Contains(results, result => result.MemberNames.Contains("Password"));
        }
    }

    [Fact]
    public void EnforcesExactMinimumAndBcryptUtf8Limit()
    {
        Assert.False(PasswordPolicy.IsValid("Aa1!" + new string('x', 7)));
        Assert.True(PasswordPolicy.IsValid("Aa1!" + new string('x', 8)));
        Assert.True(PasswordPolicy.IsValid("Aa1!" + new string('x', 68)));
        Assert.False(PasswordPolicy.IsValid("Aa1!" + new string('x', 69)));
        var unicode = "Aa1!" + new string('ä', 34);
        Assert.Equal(72, Encoding.UTF8.GetByteCount(unicode));
        Assert.True(PasswordPolicy.IsValid(unicode));
        Assert.False(PasswordPolicy.IsValid(unicode + "ä"));
    }

    [Fact]
    public void ValidPasswordsAreSaltedAndSeedPolicyAlsoProtectsAdmins()
    {
        const string password = "StrongPassword123!";
        var hasher = new BCryptPasswordHasher();
        var first = hasher.Hash(password);
        Assert.NotEqual(first, hasher.Hash(password));
        Assert.True(hasher.Verify(password, first));
        Assert.False(hasher.Verify("WrongPassword123!", first));
        var maximum = "Aa1!" + new string('x', 68);
        var maximumHash = hasher.Hash(maximum);
        Assert.True(hasher.Verify(maximum, maximumHash));
        Assert.False(hasher.Verify(maximum + "x", maximumHash));
        Assert.Throws<InvalidOperationException>(() =>
            new SeedOptions { Enabled = true, DefaultPassword = "weakpasswordlong" }.Validate());
        new SeedOptions { Enabled = true, DefaultPassword = password }.Validate();
    }
}
