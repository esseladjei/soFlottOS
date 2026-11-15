using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.DependencyInjection;
using soFlottOS.Api.Common;
using soFlottOS.Api.Controllers;
using soFlottOS.Api.Dtos;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class DriverCreationAuthorizationTests
{
    [Fact]
    public async Task DriverCreationRequiresAdminAndNoPublicDriverRegistrationExists()
    {
        var method = typeof(AdminController).GetMethod(nameof(AdminController.CreateDriver))!;
        var route = Assert.Single(method.GetCustomAttributes(typeof(HttpPostAttribute), false).Cast<HttpPostAttribute>());
        Assert.Equal("drivers", route.Template);
        Assert.DoesNotContain(method.GetCustomAttributes(true), attribute => attribute is IAllowAnonymous);

        var authorize = Assert.Single(typeof(AdminController)
            .GetCustomAttributes(typeof(AuthorizeAttribute), false).Cast<AuthorizeAttribute>());
        Assert.Equal(Roles.Admin, authorize.Roles);

        var services = new ServiceCollection().AddLogging().AddAuthorization().BuildServiceProvider();
        var policy = await AuthorizationPolicy.CombineAsync(
            services.GetRequiredService<IAuthorizationPolicyProvider>(), [authorize]);
        var authorization = services.GetRequiredService<IAuthorizationService>();
        foreach (var role in new[] { "Admin", "Client", "Driver" })
        {
            var user = new ClaimsPrincipal(new ClaimsIdentity(
                [new Claim(ClaimTypes.NameIdentifier, "1"), new Claim(ClaimTypes.Role, role)], "test"));
            var result = await authorization.AuthorizeAsync(user, null, policy!);
            Assert.Equal(role == "Admin", result.Succeeded);
        }
        Assert.False((await authorization.AuthorizeAsync(new ClaimsPrincipal(), null, policy!)).Succeeded);

        var publicActions = typeof(AuthController).GetMethods()
            .Where(action => action.GetCustomAttributes(typeof(HttpMethodAttribute), true).Length > 0);
        Assert.DoesNotContain(publicActions, action =>
            action.GetParameters().Any(parameter => parameter.ParameterType == typeof(RegisterDriverRequest)));
    }
}
