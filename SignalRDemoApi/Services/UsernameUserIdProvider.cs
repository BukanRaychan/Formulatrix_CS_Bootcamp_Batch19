using Microsoft.AspNetCore.SignalR;

namespace SignalRDemoApi.Services;

// Without authentication, SignalR has no "user identifier" to route Clients.User(id)
// to. This demo has no login system, so we treat the ?username= query string sent
// at connection time as the identifier. In a real app this would come from
// ClaimTypes.NameIdentifier on an authenticated ClaimsPrincipal instead.
public class UsernameUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection) =>
        connection.GetHttpContext()?.Request.Query["username"];
}
