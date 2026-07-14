import { memo, useCallback, useRef, useState } from "react";
import { Demo } from "../components/Demo";
import { RenderBadge } from "../components/RenderBadge";
import { useRenderCount } from "../hooks/useRenderCount";
import { useLog } from "../hooks/useLog";

const Child = memo(function Child({
  onIncrement,
  label,
}: {
  onIncrement: () => void;
  label: string;
}) {
  const renders = useRenderCount();
  return (
    <div className="compare-col">
      <h3>{label}</h3>
      <button onClick={onIncrement}>Increment from child</button>
      <div style={{ marginTop: 8 }}>
        <RenderBadge count={renders} />
      </div>
    </div>
  );
});

function StabilityDemo() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  const [unrelated, setUnrelated] = useState(0);

  const incUnstable = () => setCountA((c) => c + 1);
  const incStable = useCallback(() => setCountB((c) => c + 1), []);

  return (
    <div>
      <div className="row">
        <button onClick={() => setUnrelated((u) => u + 1)}>
          Trigger unrelated parent state change ({unrelated})
        </button>
      </div>
      <p className="hint">
        Parent counts &mdash; A: {countA}, B: {countB}. Both children are
        wrapped in <code>React.memo</code>, so they only re-render when a
        prop actually changes identity.
      </p>
      <div className="compare-grid">
        <Child label="Inline arrow fn (no useCallback)" onIncrement={incUnstable} />
        <Child label="useCallback(fn, [])" onIncrement={incStable} />
      </div>
      <p className="hint">
        Click the "unrelated" button a few times: the left child's render
        count keeps climbing (new function reference every parent render),
        the right one stays put.
      </p>
    </div>
  );
}

function useDebouncedCallback(callback: (value: string) => void, delay: number) {
  const timeoutRef = useRef<number | undefined>(undefined);
  return useCallback(
    (value: string) => {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => callback(value), delay);
    },
    [callback, delay],
  );
}

function DebouncedSearchDemo() {
  const [query, setQuery] = useState("");
  const { entries, add } = useLog();

  const runSearch = useCallback(
    (value: string) => add(`Searching for "${value}"`),
    [add],
  );
  const debouncedSearch = useDebouncedCallback(runSearch, 500);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder="Type to search (debounced 500ms)..."
      />
      <p className="hint">
        A search only fires 500ms after you stop typing. The pending timer
        id lives in a ref (see the <strong>useRef</strong> page) so
        scheduling/cancelling it doesn't itself cause re-renders, and{" "}
        <code>useCallback</code> keeps <code>runSearch</code>'s identity
        stable so the debounce wrapper isn't rebuilt on every keystroke.
      </p>
      <ul className="event-log">
        {entries.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

export function UseCallbackDemo() {
  return (
    <div>
      <div className="page-intro">
        <h1>useCallback</h1>
        <p>
          Memoizes a <em>function</em> reference across renders, the same
          way <code>useMemo</code> memoizes a value. It doesn't make the
          function run faster - it makes the function's <em>identity</em>{" "}
          stable, which matters for <code>React.memo</code> children and
          effect dependency arrays.
        </p>
      </div>

      <Demo
        title="1. Stable callbacks avoid unnecessary child re-renders"
        explanation="Same behavior, two different reference-stability strategies passed to a memoized child."
      >
        <StabilityDemo />
      </Demo>

      <Demo
        title="2. Debounced search handler"
        explanation="A practical case: the debounced function needs a stable identity, or every keystroke would create a brand new debounce timer wrapper."
      >
        <DebouncedSearchDemo />
      </Demo>
    </div>
  );
}
