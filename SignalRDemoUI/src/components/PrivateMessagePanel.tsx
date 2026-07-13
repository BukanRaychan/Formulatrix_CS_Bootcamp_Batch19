import { useState } from "react";
import type { PrivateMessage, UserInfo } from "../types";

interface Props {
  onlineUsers: UserInfo[];
  currentConnectionId: string | null;
  privateMessages: PrivateMessage[];
  onSendPrivate: (targetUsername: string, message: string) => void;
  onSendToConnection: (connectionId: string, message: string) => void;
}

export function PrivateMessagePanel({
  onlineUsers,
  currentConnectionId,
  privateMessages,
  onSendPrivate,
  onSendToConnection,
}: Props) {
  const others = onlineUsers.filter(
    (u) => u.connectionId !== currentConnectionId,
  );
  const [targetConnectionId, setTargetConnectionId] = useState("");
  const [text, setText] = useState("");

  const target = others.find((u) => u.connectionId === targetConnectionId);

  return (
    <section className="panel">
      <h2>Targeted delivery</h2>
      <p className="hint">
        <code>Clients.User(username)</code> reaches every connection that
        user has open (resolved through a custom{" "}
        <code>IUserIdProvider</code>). <code>Clients.Client(connectionId)</code>{" "}
        reaches only that one tab. Open the same username in two tabs to see
        the difference.
      </p>
      <div className="row">
        <select
          value={targetConnectionId}
          onChange={(e) => setTargetConnectionId(e.target.value)}
        >
          <option value="">Select a user...</option>
          {others.map((u) => (
            <option key={u.connectionId} value={u.connectionId}>
              {u.username} ({u.connectionId.slice(0, 8)})
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Private message..."
          disabled={!target}
        />
        <button
          disabled={!target || !text.trim()}
          onClick={() => {
            if (!target) return;
            onSendPrivate(target.username, text.trim());
            setText("");
          }}
        >
          Send to user
        </button>
        <button
          disabled={!target || !text.trim()}
          onClick={() => {
            if (!target) return;
            onSendToConnection(target.connectionId, text.trim());
            setText("");
          }}
        >
          Send to this tab only
        </button>
      </div>
      <ul className="message-list">
        {privateMessages.map((m, i) => (
          <li key={i}>
            <strong>{m.fromUser}:</strong> {m.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
