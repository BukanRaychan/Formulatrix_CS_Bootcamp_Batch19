using Microsoft.AspNetCore.SignalR;
using SignalRDemoApi.Hubs;

namespace SignalRDemoApi.Services;

// Proves SignalR pushes aren't limited to responding to a client call: this
// service holds no hub instance at all, just an injected IHubContext, and
// pushes to every connected client on its own schedule.
public class HeartbeatBackgroundService : BackgroundService
{
    private readonly IHubContext<DemoHub, IDemoHubClient> _hubContext;

    public HeartbeatBackgroundService(IHubContext<DemoHub, IDemoHubClient> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await _hubContext.Clients.All.ServerHeartbeat(DateTime.UtcNow);
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
