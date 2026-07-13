import { useState } from "react";
import type { ChatMessage } from "../types";

interface Props {
  messages: ChatMessage[];
  typingUser: string | null;
  onSendToAll: (message: string) => void;
  onSendToOthers: (message: string) => void;
  onSendToCaller: (message: string) => void;
  onTyping: (message: string) => void;
}

export function BroadcastPanel({
  messages,
  typingUser,
  onSendToAll,
  onSendToOthers,
  onSendToCaller,
  onTyping,
}: Props) {
  const [text, setText] = useState("");

  const send = (fn: (message: string) => void) => {
    if (!text.trim()) return;
    fn(text.trim());
    setText("");
  };

  return (
    <section className="panel">
      <h2>Broadcast scopes</h2>
      <p className="hint">
        Same hub method call, three different fan-out targets:{" "}
        <code>Clients.All</code>, <code>Clients.Others</code> (everyone but
        the caller) and <code>Clients.Caller</code> (echo back to sender
        only). Open a second tab to see the "others" vs "all" difference.
      </p>
      <div className="row">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && send(onSendToAll)}
          placeholder="Type a message..."
        />
        <button onClick={() => send(onSendToAll)}>All</button>
        <button onClick={() => send(onSendToOthers)}>Others</button>
        <button onClick={() => send(onSendToCaller)}>Caller</button>
      </div>
      <div className="typing-indicator">
        {typingUser? `${typingUser} is typing...` : " "}
      </div>
      <ul className="message-list">
        {messages.map((m, i) => (
          <li key={i}>
            <span className={`scope-badge scope-${m.scope}`}>{m.scope}</span>
            <strong>{m.fromUser}:</strong> {m.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
