using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.SignalR;
using SignalRDemoApi.Services;

namespace SignalRDemoApi.Hubs;

public class DemoHub : Hub<IDemoHubClient>
{
    private readonly UserTracker _userTracker;

    public DemoHub(UserTracker userTracker)
    {
        _userTracker = userTracker;
    }

    private string Username => Context.UserIdentifier ?? "anonymous";

    // ----- Connection lifecycle -----

    public override async Task OnConnectedAsync()
    {
        _userTracker.AddConnection(Context.ConnectionId, Username);
        await Clients.All.OnlineUsersUpdated(_userTracker.GetOnlineUsers());
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _userTracker.RemoveConnection(Context.ConnectionId);
        await Clients.All.OnlineUsersUpdated(_userTracker.GetOnlineUsers());
        await base.OnDisconnectedAsync(exception);
    }

    // ----- Broadcast scopes: All / Others / Caller -----

    public Task SendToAll(string message) =>
        Clients.All.ReceiveMessage(Username, message, "all");

    public Task SendToOthers(string message) =>
        Clients.Others.ReceiveMessage(Username, message, "others");

    public Task SendToCaller(string message) =>
        Clients.Caller.ReceiveMessage(Username, message, "caller");

    // ----- Targeted delivery -----

    // Clients.Client: addressed by the transient connection id (one browser tab).
    public Task SendToConnection(string connectionId, string message) =>
        Clients.Client(connectionId).ReceiveMessage(Username, message, "direct-connection");

    // Clients.User: addressed by the stable user identifier (every tab/device
    // that user has open), resolved via UsernameUserIdProvider.
    public Task SendPrivate(string targetUsername, string message) =>
        Clients.User(targetUsername).ReceivePrivateMessage(Username, message);

    // ----- Groups -----

    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).GroupJoined(Username, groupName);
    }

    public async Task LeaveGroup(string groupName)
    {
        await Clients.Group(groupName).GroupLeft(Username, groupName);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }

    public Task SendToGroup(string groupName, string message) =>
        Clients.Group(groupName).ReceiveGroupMessage(Username, message, groupName);

    // ----- Ephemeral event (no state, just a live notification) -----

    public Task Typing(string message) => Clients.Others.UserTyping(Username, message == "");

    // ----- Server-to-client streaming -----
    // The client calls connection.stream(...) and gets items pushed to it
    // as they're produced, instead of waiting for one big response.
    public async IAsyncEnumerable<int> StreamCounter(
        int count,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        for (var i = 1; i <= count; i++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            await Task.Delay(400, cancellationToken);
            yield return i;
        }
    }

    // ----- Client-to-server streaming -----
    // The client calls connection.send(...) with an async iterable/channel;
    // chunks arrive here one at a time as the client produces them.
    public async Task UploadStream(IAsyncEnumerable<string> stream)
    {
        var chunksReceived = 0;
        await foreach (var chunk in stream)
        {
            chunksReceived++;
            await Clients.Caller.UploadProgress(chunksReceived, chunk);
        }
    }
}
