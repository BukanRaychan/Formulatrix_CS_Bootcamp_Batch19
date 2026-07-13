# SignalR Feature Tour — Backend

ASP.NET Core 8 Web API demonstrating (almost) everything ASP.NET Core SignalR can do. Built as part of Formulatrix CS Bootcamp Batch 19, paired with the [SignalRDemoUI](../SignalRDemoUI) React frontend.

---

## What is SignalR?

SignalR is ASP.NET Core's library for **real-time, bidirectional communication** between server and client. Instead of the client repeatedly polling "anything new?", the server can push data to connected clients the instant something happens. Under the hood it picks the best available transport (WebSockets, then falls back to Server-Sent Events, then long polling) and exposes a single consistent API regardless of which one is used.

The central abstraction is a **Hub**: a class the client can call methods on (RPC-style), and which the server can use to call methods back on one, some, or all connected clients.

---

## Project layout

```
Hubs/
  DemoHub.cs            The hub — every messaging pattern lives here
  IDemoHubClient.cs      Strongly-typed contract for client-side methods
Services/
  UserTracker.cs               In-memory presence tracking (connectionId -> username)
  UsernameUserIdProvider.cs     Custom IUserIdProvider (see "Clients.User" below)
  HeartbeatBackgroundService.cs Pushes to clients with no hub call involved
Controllers/
  NotificationsController.cs   A REST endpoint that also pushes via SignalR
Models/
  UserInfo.cs
```

---

## Concepts demonstrated, and where

### 1. Strongly-typed hubs — `Hub<T>`
`DemoHub : Hub<IDemoHubClient>` instead of plain `Hub`. This makes `Clients.All.ReceiveMessage(...)` a compile-time checked call instead of the untyped `Clients.All.SendAsync("ReceiveMessage", ...)`. `IDemoHubClient` is the contract for every method the server can invoke on a connected client.

### 2. Connection lifecycle
`OnConnectedAsync` / `OnDisconnectedAsync` are overridden to maintain a live presence list (`UserTracker`), broadcast it to everyone, and clean up when a client leaves — including on ungraceful disconnects (closed tab, lost network).

### 3. Broadcast scopes: `Clients.All` / `Clients.Others` / `Clients.Caller`
Three ways to fan a message out from one hub method call:
- `Clients.All` — every connected client, including the sender.
- `Clients.Others` — every client *except* the sender.
- `Clients.Caller` — only the client that invoked the method (an echo/ack pattern).

### 4. Targeted delivery: `Clients.Client` vs `Clients.User`
- `Clients.Client(connectionId)` — addresses one specific *connection* (one browser tab).
- `Clients.User(userId)` — addresses every connection belonging to one *user* (all their open tabs/devices). This requires a way to resolve a stable user identifier from a connection, which normally comes from the authenticated `ClaimsPrincipal`. Since this demo has no login system, `UsernameUserIdProvider` (a custom `IUserIdProvider`) treats the `?username=` query string sent at connect time as the identifier instead.

### 5. Groups
`Groups.AddToGroupAsync` / `RemoveFromGroupAsync` put a connection into an arbitrary named bucket that isn't tied to any other concept in the app (not a DB table, not a role — just a label SignalR tracks server-side per connection). `Clients.Group(name)` then broadcasts to everyone currently in it. Great for chat rooms, per-document collaborators, per-tenant dashboards, etc.

### 6. Ephemeral / fire-and-forget events
`Typing()` broadcasts a "user is typing" notification via `Clients.Others` with no persisted state at all — a good example of an event that's purely transient, unlike a chat message.

### 7. Server-to-client streaming
`StreamCounter(int count)` returns `IAsyncEnumerable<int>`. Instead of computing a whole result and returning it once, the hub method yields values over time and SignalR pushes each one to the client as it's produced (`connection.stream(...)` on the client side). Good for progress bars, live search results, or any dataset too large/slow to send as one payload.

### 8. Client-to-server streaming
`UploadStream(IAsyncEnumerable<string> stream)` accepts a stream as a parameter. The client sends chunks over time (via a `Subject` — the JS client only recognizes objects with `.subscribe`, not plain async generators, as streaming parameters), and the server processes each one as it arrives, echoing progress back. Useful for chunked uploads or live client-side data (e.g. sensor readings) without opening a new request per chunk.

### 9. Pushing from outside a hub — `IHubContext<THub, TClient>`
Two places in this project push to clients **without any client ever calling a hub method**, proving SignalR isn't limited to request/response inside a hub:
- `HeartbeatBackgroundService` — a `BackgroundService` that ticks every 5 seconds and pushes the server clock to everyone, entirely on its own schedule.
- `NotificationsController` — a plain REST controller (`POST /api/notifications/broadcast`) that reaches into `IHubContext` to notify every connected client. This is exactly how you'd wire up a webhook handler or a message-queue consumer to notify connected users.

### 10. CORS for a separate frontend origin
Since the React dev server runs on a different origin (`http://localhost:5173`) than the API (`http://localhost:5066`), CORS is configured with `AllowCredentials()` (SignalR's negotiate handshake needs it) restricted to that one origin.

### Not demonstrated here (but worth knowing exist)
- **Authentication/authorization on hubs** (`[Authorize]` on a hub or hub method) — skipped to keep the demo login-free; `Clients.User` normally relies on this.
- **Scaling out with a backplane** (Redis/Azure SignalR Service) — needed once you run more than one server process, so multiple instances can relay messages to each other's connections.
- **MessagePack protocol** — a binary alternative to the default JSON protocol for lower payload size/latency.

---

## Running

```bash
dotnet run
```

Serves on `http://localhost:5066` (see `Properties/launchSettings.json`). Swagger UI is available at `/swagger` in development. The hub is mapped at `/hubs/demo`.
