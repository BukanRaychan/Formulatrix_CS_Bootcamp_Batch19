using System.Collections.Concurrent;
using SignalRDemoApi.Models;

namespace SignalRDemoApi.Services;

// Singleton in-memory presence tracker. One username can hold multiple
// connections (e.g. two browser tabs), which is exactly what Clients.User
// is designed to fan out to.
public class UserTracker
{
    private readonly ConcurrentDictionary<string, string> _connections = new();

    public void AddConnection(string connectionId, string username) =>
        _connections[connectionId] = username;

    public void RemoveConnection(string connectionId) =>
        _connections.TryRemove(connectionId, out _);

    public List<UserInfo> GetOnlineUsers() =>
        _connections
            .Select(kvp => new UserInfo(kvp.Key, kvp.Value))
            .OrderBy(u => u.Username)
            .ToList();

    public int OnlineCount => _connections.Count;
}
