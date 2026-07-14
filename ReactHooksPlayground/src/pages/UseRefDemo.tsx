import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { Demo } from "../components/Demo";
import { useLog } from "../hooks/useLog";

function RefVsStateDemo() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);
  const [, forceRerender] = useState(0);

  return (
    <div className="compare-grid">
      <div className="compare-col">
        <h3>useState(0)</h3>
        <button onClick={() => setStateCount((c) => c + 1)}>
          Increment state
        </button>
        <p className="big-number">{stateCount}</p>
        <p className="hint">
          <code>setStateCount</code> schedules a re-render, so the number on
          screen updates immediately.
        </p>
      </div>
      <div className="compare-col">
        <h3>useRef(0)</h3>
        <button
          onClick={() => {
            refCount.current += 1;
          }}
        >
          Increment ref.current
        </button>
        <p className="big-number">{refCount.current}</p>
        <p className="hint">
          <code>refCount.current</code> is genuinely updated every click, but
          nothing tells React to re-render, so this number is stale until
          something else forces one.
        </p>
        <button onClick={() => forceRerender((t) => t + 1)}>
          Force a re-render to reveal the real value
        </button>
      </div>
    </div>
  );
}

function FocusInputDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="row">
      <input ref={inputRef} placeholder="Click the button to focus me" />
      <button onClick={() => inputRef.current?.focus()}>Focus input</button>
    </div>
  );
}

function MeasureBoxDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  const measure = () => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (rect) setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
  };

  return (
    <div>
      <div ref={boxRef} className="measure-box">
        Drag the bottom-right corner to resize me, then measure.
      </div>
      <div className="row" style={{ marginTop: 8 }}>
        <button onClick={measure}>Measure</button>
        {size && (
          <span>
            Width: {size.w}px, Height: {size.h}px
          </span>
        )}
      </div>
    </div>
  );
}

const SCROLL_ITEMS = Array.from({ length: 50 }, (_, i) => i);

function ScrollIntoViewDemo() {
  const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());
  const [target, setTarget] = useState(37);

  const jump = () => {
    itemRefs.current.get(target)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div>
      <div className="row">
        <input
          type="number"
          min={0}
          max={49}
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
        />
        <button onClick={jump}>Jump to item #{target}</button>
      </div>
      <div className="scroll-box">
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {SCROLL_ITEMS.map((i) => (
            <li
              key={i}
              ref={(el) => {
                if (el) itemRefs.current.set(i, el);
              }}
              className={i === target ? "scroll-item highlight" : "scroll-item"}
            >
              Item #{i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ScrollPositionDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLSpanElement>(null);

  const handleScroll = () => {
    const top = containerRef.current?.scrollTop ?? 0;
    // Written straight to the DOM node, skipping React state and a
    // re-render entirely - the standard move for high-frequency events
    // like scroll or mousemove where a render-per-event would be wasteful.
    if (displayRef.current) {
      displayRef.current.textContent = `${Math.round(top)}px`;
    }
  };

  return (
    <div>
      <p className="hint">
        Scroll position: <span ref={displayRef}>0px</span>
      </p>
      <div className="scroll-box" ref={containerRef} onScroll={handleScroll}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {SCROLL_ITEMS.map((i) => (
            <li key={i} className="scroll-item">
              Row {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function PreviousValueDemo() {
  const [count, setCount] = useState(0);
  const previous = usePrevious(count);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <p>
        Current: <strong>{count}</strong>, Previous:{" "}
        <strong>{previous ?? "(none yet)"}</strong>
      </p>
    </div>
  );
}

function StopwatchDemo() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);
  const startedAtRef = useRef(0);

  const start = () => {
    if (intervalRef.current) return;
    setRunning(true);
    startedAtRef.current = Date.now() - elapsedMs;
    intervalRef.current = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 50);
  };

  const stop = () => {
    window.clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    setRunning(false);
  };

  const reset = () => {
    stop();
    setElapsedMs(0);
  };

  useEffect(() => () => window.clearInterval(intervalRef.current), []);

  return (
    <div>
      <p className="big-number">{(elapsedMs / 1000).toFixed(2)}s</p>
      <div className="row">
        <button onClick={start} disabled={running}>
          Start
        </button>
        <button onClick={stop} disabled={!running}>
          Stop
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      <p className="hint">
        The interval id lives in a ref, not state. Storing it in state would
        also "work," but every start/stop would trigger a pointless
        re-render just to hold a number nothing ever displays.
      </p>
    </div>
  );
}

function LatestRefDemo() {
  const [likes, setLikes] = useState(0);
  const { entries: staleLog, add: addStale } = useLog();
  const { entries: freshLog, add: addFresh } = useLog();
  const latestLikes = useRef(likes);

  useEffect(() => {
    latestLikes.current = likes;
  }, [likes]);

  useEffect(() => {
    const id = setInterval(() => addFresh(`likes = ${latestLikes.current}`), 2000);
    return () => clearInterval(id);
  }, [addFresh]);

  useEffect(() => {
    const id = setInterval(() => addStale(`likes = ${likes}`), 2000);
    return () => clearInterval(id);
    // Deliberately omitting `likes` to reproduce the stale-closure bug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStale]);

  return (
    <div>
      <button onClick={() => setLikes((l) => l + 1)}>Like ({likes})</button>
      <div className="compare-grid">
        <div className="compare-col">
          <h3>Reads state directly (stale closure)</h3>
          <ul className="event-log">
            {staleLog.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
        <div className="compare-col">
          <h3>Reads latestLikes.current (fresh)</h3>
          <ul className="event-log">
            {freshLog.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="hint">
        Both intervals were set up once, on mount, and never re-subscribe.
        The left one closed over <code>likes</code> as it was at that
        moment and is frozen forever. The right one reads a ref that a
        separate effect keeps in sync on every render, so it always sees
        the current value.
      </p>
    </div>
  );
}

interface StopwatchHandle {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

function ControlledStopwatch({ ref }: { ref: Ref<StopwatchHandle> }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);
  const startedAtRef = useRef(0);

  useImperativeHandle(ref, () => ({
    start: () => {
      if (intervalRef.current) return;
      startedAtRef.current = Date.now() - elapsedMs;
      intervalRef.current = window.setInterval(
        () => setElapsedMs(Date.now() - startedAtRef.current),
        50,
      );
    },
    stop: () => {
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    },
    reset: () => {
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      setElapsedMs(0);
    },
  }));

  return <p className="big-number">{(elapsedMs / 1000).toFixed(2)}s</p>;
}

function ImperativeHandleDemo() {
  const stopwatchRef = useRef<StopwatchHandle>(null);
  return (
    <div>
      <ControlledStopwatch ref={stopwatchRef} />
      <div className="row">
        <button onClick={() => stopwatchRef.current?.start()}>Start</button>
        <button onClick={() => stopwatchRef.current?.stop()}>Stop</button>
        <button onClick={() => stopwatchRef.current?.reset()}>Reset</button>
      </div>
      <p className="hint">
        The parent never passes props telling the child what to render for
        each state &mdash; it holds a ref to the child and calls methods on
        it directly, like calling a method on a class instance. This is the
        escape hatch for imperative APIs (video players, canvas drawing,
        map viewports) that don't map cleanly onto declarative props.
      </p>
    </div>
  );
}

export function UseRefDemo() {
  return (
    <div>
      <div className="page-intro">
        <h1>useRef</h1>
        <p>
          <code>useRef(initialValue)</code> returns a plain mutable object
          shaped like <code>{"{ current: initialValue }"}</code>. Two things
          make it different from state: it <strong>persists</strong> across
          re-renders (it isn't reset like a local variable would be), and{" "}
          <strong>mutating <code>.current</code> does not itself cause a
          re-render</strong>. Refs are for values the component needs to
          remember, but that the UI shouldn't reactively update in response
          to &mdash; DOM nodes, timer ids, "the last value I saw."
        </p>
      </div>

      <Demo
        title="1. The basic concept: ref vs. state"
        explanation="Same action - incrementing a number - through two different hooks. Watch what it takes to actually see the ref's value on screen."
      >
        <RefVsStateDemo />
      </Demo>

      <Demo
        title="2. DOM access: focus an element"
        explanation={<>Attach a ref to a DOM element via <code>ref={"{inputRef}"}</code> and it becomes the actual DOM node - here, calling the browser's native <code>.focus()</code>.</>}
      >
        <FocusInputDemo />
      </Demo>

      <Demo
        title="3. DOM access: measure an element"
        explanation="Reading layout (size, position) requires the real DOM node, which only a ref gives you."
      >
        <MeasureBoxDemo />
      </Demo>

      <Demo
        title="4. Scroll behavior: scroll a specific item into view"
        explanation={<>Each list item registers itself in a <code>Map</code> ref keyed by index; jumping calls the native <code>scrollIntoView</code> on the right node.</>}
      >
        <ScrollIntoViewDemo />
      </Demo>

      <Demo
        title="5. Scroll behavior: live position readout without re-rendering"
        explanation="Scroll events can fire dozens of times a second. Writing the value straight into a DOM node's textContent avoids putting the whole component through React's render cycle for every single event."
      >
        <ScrollPositionDemo />
      </Demo>

      <Demo
        title="6. Storing a mutable value: track the previous value"
        explanation={<>The classic <code>usePrevious</code> pattern: a ref updated inside a <code>useEffect</code> that runs after every render, so it always lags one render behind current state.</>}
      >
        <PreviousValueDemo />
      </Demo>

      <Demo
        title="7. Timer ids across renders: a stopwatch"
        explanation={<>The <code>setInterval</code> id must survive re-renders so <code>Stop</code> can find and clear the right one, but the id itself is never displayed - a textbook case for a ref instead of state.</>}
      >
        <StopwatchDemo />
      </Demo>

      <Demo
        title="8. Avoiding stale closures: the 'latest ref' pattern"
        explanation="An effect that sets up a subscription/interval once (empty deps) closes over whatever state existed at that moment. Mirroring the latest value into a ref lets long-lived callbacks read fresh data without re-subscribing."
      >
        <LatestRefDemo />
      </Demo>

      <Demo
        title="9. Imperative child API: useImperativeHandle"
        explanation="Sometimes a parent needs to command a child directly - play/pause/reset - rather than describe its state through props. A ref to the child plus useImperativeHandle exposes exactly the methods you choose."
      >
        <ImperativeHandleDemo />
      </Demo>
    </div>
  );
}
