import { useEffect, useRef, useState } from "react";
import { Demo } from "../components/Demo";
import { useLog } from "../hooks/useLog";

function MountOnlyDemo() {
  const { entries, add } = useLog();

  useEffect(() => {
    add("Effect ran (mount only - empty dependency array)");
    document.title = "useEffect demo - mounted";
    return () => add("Cleanup ran (unmount)");
  }, []);

  const [, bump] = useState(0);

  return (
    <div>
      <button onClick={() => bump((b) => b + 1)}>
        Re-render this component
      </button>
      <p className="hint">
        Click as many times as you want &mdash; the effect above only logged
        once, when the component first mounted.
      </p>
      <ul className="event-log">
        {entries.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

function DependencyArrayDemo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const { entries, add } = useLog();

  useEffect(() => {
    add(`Effect ran because "a" is now ${a}`);
  }, [a]);

  return (
    <div>
      <div className="row">
        <button onClick={() => setA((v) => v + 1)}>Increment A ({a})</button>
        <button onClick={() => setB((v) => v + 1)}>
          Increment B ({b}) &mdash; not in deps
        </button>
      </div>
      <ul className="event-log">
        {entries.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

function CleanupTimerDemo() {
  const [mounted, setMounted] = useState(true);
  return (
    <div>
      <button onClick={() => setMounted((m) => !m)}>
        {mounted ? "Unmount" : "Mount"} the timer
      </button>
      {mounted && <Ticker />}
    </div>
  );
}

function Ticker() {
  const [ticks, setTicks] = useState(0);
  const { entries, add } = useLog();

  useEffect(() => {
    add("Interval started");
    const id = setInterval(() => setTicks((t) => t + 1), 1000);
    return () => {
      clearInterval(id);
      add("Interval cleared - no leak after unmount");
    };
  }, [add]);

  return (
    <div>
      <p className="big-number">{ticks}</p>
      <ul className="event-log">
        {entries.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

function fakeFetchUser(id: number): Promise<string> {
  const delay = 300 + Math.random() * 700;
  return new Promise((resolve) => setTimeout(() => resolve(`User #${id}`), delay));
}

function RaceConditionDemo() {
  const [selectedId, setSelectedId] = useState(1);
  const [result, setResult] = useState("");
  const { entries, add } = useLog();
  const requestCounter = useRef(0);

  useEffect(() => {
    let ignore = false;
    const id = selectedId;
    requestCounter.current += 1;
    const requestNumber = requestCounter.current;
    add(`Request #${requestNumber} started for user ${id}`);

    fakeFetchUser(id).then((data) => {
      if (ignore) {
        add(`Request #${requestNumber} resolved for user ${id} - ignored (stale)`);
        return;
      }
      add(`Request #${requestNumber} resolved for user ${id} - applied`);
      setResult(data);
    });

    return () => {
      ignore = true;
    };
  }, [selectedId]);

  return (
    <div>
      <p className="hint">
        Click quickly &mdash; each request finishes at a random time, but
        only the response for the <em>currently selected</em> id is ever
        applied to <code>result</code>.
      </p>
      <div className="row">
        {[1, 2, 3, 4].map((id) => (
          <button key={id} onClick={() => setSelectedId(id)}>
            Load user {id}
          </button>
        ))}
      </div>
      <p>
        Displayed result: <strong>{result || "(loading...)"}</strong>
      </p>
      <ul className="event-log">
        {entries.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

export function UseEffectDemo() {
  return (
    <div>
      <div className="page-intro">
        <h1>useEffect</h1>
        <p>
          Runs a side effect after render, and optionally cleans it up before
          the next run or on unmount. The dependency array controls{" "}
          <em>when</em> it re-runs.
        </p>
      </div>

      <Demo
        title="1. Runs once on mount"
        explanation={<>An empty dependency array (<code>[]</code>) means the effect runs once after the first render, and its cleanup runs once on unmount.</>}
      >
        <MountOnlyDemo />
      </Demo>

      <Demo
        title="2. The dependency array decides what triggers a re-run"
        explanation={<>The effect only depends on <code>a</code>. Changing <code>b</code> re-renders the component but does not re-run this effect.</>}
      >
        <DependencyArrayDemo />
      </Demo>

      <Demo
        title="3. Cleanup prevents leaks"
        explanation="Unmounting while the interval is running would keep ticking forever without a cleanup function that clears it."
      >
        <CleanupTimerDemo />
      </Demo>

      <Demo
        title="4. Guarding against race conditions"
        explanation={<>Fast, out-of-order async responses are a classic bug: an old request can resolve after a newer one and overwrite fresher data. The <code>ignore</code> flag set in the cleanup function discards results from a stale effect run.</>}
      >
        <RaceConditionDemo />
      </Demo>
    </div>
  );
}
