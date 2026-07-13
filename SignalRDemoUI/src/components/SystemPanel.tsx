import { useState } from "react";
import { API_BASE_URL } from "../hooks/useDemoHub";

interface Props {
  heartbeat: string | null;
  systemNotification: string | null;
}

export function SystemPanel({ heartbeat, systemNotification }: Props) {
  const [message, setMessage] = useState("Scheduled maintenance in 5 minutes");
  const [sending, setSending] = useState(false);

  const triggerBroadcast = async () => {
    setSending(true);
    try {
      await fetch(`${API_BASE_URL}/notifications/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="panel">
      <h2>Server-initiated push</h2>
      <p className="hint">
        Two pushes here happen with no client invoking a hub method at all,
        via an injected <code>IHubContext&lt;DemoHub, IDemoHubClient&gt;</code>.
      </p>

      <h3>Background service heartbeat</h3>
      <p className="hint">
        A <code>BackgroundService</code> ticks every 5 seconds and pushes the
        server clock to every connected client.
      </p>
      <div className="kv">
        <dt>Last heartbeat</dt>
        <dd>{heartbeat ? new Date(heartbeat).toLocaleTimeString() : "waiting..."}</dd>
      </div>

      <h3>REST endpoint push</h3>
      <p className="hint">
        <code>POST /api/notifications/broadcast</code> is a normal
        controller action that reaches into <code>IHubContext</code> to
        notify every connected client &mdash; useful for webhooks, queue
        consumers, or any code that isn't itself a hub.
      </p>
      <div className="row">
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button disabled={sending} onClick={triggerBroadcast}>
          Trigger REST broadcast
        </button>
      </div>
      {systemNotification && (
        <p className="system-banner">{systemNotification}</p>
      )}
    </section>
  );
}
