import { useState } from "react";

interface Props {
  streamValues: number[];
  streaming: boolean;
  onStartCounterStream: (count: number) => void;
  uploadProgress: { count: number; lastChunk: string } | null;
  uploading: boolean;
  onStartUploadStream: (chunks: string[]) => void;
}

export function StreamingPanel({
  streamValues,
  streaming,
  onStartCounterStream,
  uploadProgress,
  uploading,
  onStartUploadStream,
}: Props) {
  const [count, setCount] = useState(10);
  const [chunkText, setChunkText] = useState(
    "chunk-1, chunk-2, chunk-3, chunk-4, chunk-5",
  );

  return (
    <section className="panel">
      <h2>Streaming</h2>
      <p className="hint">
        SignalR doesn't just do request/response &mdash; a hub method can
        return <code>IAsyncEnumerable&lt;T&gt;</code> to push items to the
        client one at a time (<code>connection.stream</code>), or accept an{" "}
        <code>IAsyncEnumerable&lt;T&gt;</code> parameter to receive chunks
        produced by the client over time (<code>connection.send</code> with
        a <code>Subject</code>).
      </p>

      <h3>Server &rarr; client</h3>
      <div className="row">
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <button disabled={streaming} onClick={() => onStartCounterStream(count)}>
          {streaming ? "Streaming..." : "Start server stream"}
        </button>
      </div>
      <div className="stream-track">
        {streamValues.map((v) => (
          <span className="stream-chip" key={v}>
            {v}
          </span>
        ))}
      </div>

      <h3>Client &rarr; server</h3>
      <div className="row">
        <input
          value={chunkText}
          onChange={(e) => setChunkText(e.target.value)}
          placeholder="Comma-separated chunks"
        />
        <button
          disabled={uploading}
          onClick={() =>
            onStartUploadStream(
              chunkText
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean),
            )
          }
        >
          {uploading ? "Uploading..." : "Start client upload stream"}
        </button>
      </div>
      {uploadProgress && (
        <p className="hint">
          Server has received <strong>{uploadProgress.count}</strong> chunk(s)
          so far. Last chunk: <code>{uploadProgress.lastChunk}</code>
        </p>
      )}
    </section>
  );
}
