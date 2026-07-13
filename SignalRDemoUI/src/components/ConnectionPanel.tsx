import type { ConnectionState } from "../types";

interface Props {
  username: string;
  connectionState: ConnectionState;
  connectionId: string | null;
  onDisconnect: () => void;
}

const STATE_LABEL: Record<ConnectionState, string> = {
  disconnected: "Disconnected",
  connecting: "Connecting...",
  connected: "Connected",
  reconnecting: "Reconnecting...",
};

export function ConnectionPanel({
  username,
  connectionState,
  connectionId,
  onDisconnect,
}: Props) {
  return (
    <section className="panel">
      <h2>Connection</h2>
      <p className="hint">
        One <code>HubConnection</code> per browser tab. Reconnect delays of{" "}
        <code>[0, 2000, 5000, 10000]</code>ms are handled automatically by{" "}
        <code>withAutomaticReconnect</code> &mdash; kill the backend and
        restart it to see this panel flip to "Reconnecting..." and then
        recover on its own.
      </p>
      <dl className="kv">
        <dt>Username</dt>
        <dd>{username}</dd>
        <dt>Status</dt>
        <dd>
          <span className={`status-dot status-${connectionState}`} />
          {STATE_LABEL[connectionState]}
        </dd>
        <dt>Connection Id</dt>
        <dd>{connectionId ?? "-"}</dd>
      </dl>
      <button onClick={onDisconnect}>Disconnect</button>
    </section>
  );
}
