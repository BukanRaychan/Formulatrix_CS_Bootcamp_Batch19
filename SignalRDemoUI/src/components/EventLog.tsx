import type { LogEntry } from "../types";

interface Props {
  log: LogEntry[];
}

export function EventLog({ log }: Props) {
  return (
    <section className="panel panel-log">
      <h2>Raw event log</h2>
      <p className="hint">Every hub event this client received, in order.</p>
      <ul className="event-log">
        {[...log].reverse().map((entry) => (
          <li key={entry.id} className={`log-${entry.kind}`}>
            <span className="log-time">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            {entry.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
