using SignalRDemoApi.Models;

namespace SignalRDemoApi.Hubs;

// Implementing Hub<IDemoHubClient> instead of plain Hub gives compile-time
// checked, IntelliSense-able client calls (Clients.All.ReceiveMessage(...))
// instead of the untyped Clients.All.SendAsync("ReceiveMessage", ...).
public interface IDemoHubClient
{
    Task ReceiveMessage(string fromUser, string message, string scope);
    Task ReceivePrivateMessage(string fromUser, string message);
    Task ReceiveGroupMessage(string fromUser, string message, string groupName);

    Task OnlineUsersUpdated(List<UserInfo> users);
    Task UserTyping(string username, bool isStopTyping);

    Task GroupJoined(string username, string groupName);
    Task GroupLeft(string username, string groupName);

    Task ServerHeartbeat(DateTime serverTimeUtc);
    Task SystemNotification(string message);

    Task UploadProgress(int chunksReceived, string lastChunk);
}
