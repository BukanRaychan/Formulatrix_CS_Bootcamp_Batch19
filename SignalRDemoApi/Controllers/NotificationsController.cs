using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRDemoApi.Hubs;

namespace SignalRDemoApi.Controllers;

// A plain REST endpoint, unrelated to any hub connection, that pushes a
// message to every connected client via IHubContext. This is how you'd
// notify SignalR clients from anywhere in an app: a webhook handler, a
// message queue consumer, another controller, etc.
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IHubContext<DemoHub, IDemoHubClient> _hubContext;

    public NotificationsController(IHubContext<DemoHub, IDemoHubClient> hubContext)
    {
        _hubContext = hubContext;
    }

    public record BroadcastRequest(string Message);

    [HttpPost("broadcast")]
    public async Task<IActionResult> Broadcast(BroadcastRequest request)
    {
        await _hubContext.Clients.All.SystemNotification(request.Message);
        return Ok();
    }
}
