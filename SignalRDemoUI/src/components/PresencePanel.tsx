import type { UserInfo } from "../types";

interface Props {
  onlineUsers: UserInfo[];
  currentConnectionId: string | null;
}

export function PresencePanel({ onlineUsers, currentConnectionId }: Props) {
  return (
    <section className="panel">
      <h2>Presence ({onlineUsers.length})</h2>
      <p className="hint">
        Tracked with an in-memory <code>UserTracker</code> singleton updated
        from the hub's <code>OnConnectedAsync</code> /{" "}
        <code>OnDisconnectedAsync</code> overrides, then pushed to everyone
        via <code>Clients.All.OnlineUsersUpdated</code>. Open a second tab
        with a different username to watch this list update live.
      </p>
      <ul className="user-list">
        {onlineUsers.map((u) => (
          <li key={u.connectionId}>
            <span className="dot-online" />
            {u.username}
            <code className="conn-id">{u.connectionId}</code>
            {u.connectionId === currentConnectionId && (
              <span className="badge">you</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
