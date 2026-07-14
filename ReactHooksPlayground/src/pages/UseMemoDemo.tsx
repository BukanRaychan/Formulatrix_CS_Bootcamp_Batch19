import { memo, useMemo, useRef, useState } from "react";
import { Demo } from "../components/Demo";
import { RenderBadge } from "../components/RenderBadge";
import { useRenderCount } from "../hooks/useRenderCount";

function countPrimesUpTo(n: number) {
  let count = 0;
  for (let i = 2; i <= n; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return count;
}

function ExpensiveComputationDemo() {
  const [n, setN] = useState(50000);
  const [unrelated, setUnrelated] = useState(0);
  const recomputeCount = useRef(0);

  const { result, duration } = useMemo(() => {
    recomputeCount.current += 1;
    const start = performance.now();
    const count = countPrimesUpTo(n);
    return { result: count, duration: performance.now() - start };
  }, [n]);

  return (
    <div>
      <div className="row">
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
        <button onClick={() => setUnrelated((u) => u + 1)}>
          Toggle unrelated state ({unrelated})
        </button>
      </div>
      <p>
        Primes up to {n}: <strong>{result}</strong> ({duration.toFixed(1)}ms)
      </p>
      <p className="hint">
        Recomputed <strong>{recomputeCount.current}</strong> time(s) total.
        Clicking "toggle unrelated state" re-renders this component but
        does not touch the loop above &mdash; only changing <code>n</code>{" "}
        does.
      </p>
    </div>
  );
}

const ConfigChild = memo(function ConfigChild({
  config,
  label,
}: {
  config: { theme: string; size: number };
  label: string;
}) {
  const renders = useRenderCount();
  return (
    <div className="compare-col">
      <h3>{label}</h3>
      <p className="hint">{JSON.stringify(config)}</p>
      <RenderBadge count={renders} />
    </div>
  );
});

function ReferentialStabilityDemo() {
  const [theme] = useState("dark");
  const [size] = useState(14);
  const [unrelated, setUnrelated] = useState(0);

  const unstableConfig = { theme, size };
  const stableConfig = useMemo(() => ({ theme, size }), [theme, size]);

  return (
    <div>
      <div className="row">
        <button onClick={() => setUnrelated((u) => u + 1)}>
          Trigger unrelated parent re-render ({unrelated})
        </button>
      </div>
      <div className="compare-grid">
        <ConfigChild label="Plain object literal" config={unstableConfig} />
        <ConfigChild label="useMemo(() => ({...}), [theme, size])" config={stableConfig} />
      </div>
    </div>
  );
}

function generateItems(count: number) {
  const items: string[] = [];
  for (let i = 0; i < count; i++) {
    items.push(`item-${Math.random().toString(36).slice(2, 8)}-${i}`);
  }
  return items;
}

function FilteredListDemo() {
  const [items] = useState(() => generateItems(20000));
  const [filter, setFilter] = useState("");
  const [note, setNote] = useState("");
  const recomputeCount = useRef(0);

  const { matches, duration } = useMemo(() => {
    recomputeCount.current += 1;
    const start = performance.now();
    const result = items.filter((i) => i.includes(filter)).slice(0, 15);
    return { matches: result, duration: performance.now() - start };
  }, [items, filter]);

  return (
    <div>
      <div className="row">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter 20,000 items..."
        />
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Unrelated notes field - type here, the filter recompute count below won't move"
        rows={2}
        style={{ width: "100%" }}
      />
      <p className="hint">
        Recomputed <strong>{recomputeCount.current}</strong> time(s), last
        filter pass took {duration.toFixed(2)}ms. Showing first 15 matches:
      </p>
      <ul>
        {matches.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export function UseMemoDemo() {
  return (
    <div>
      <div className="page-intro">
        <h1>useMemo</h1>
        <p>
          Memoizes a computed <em>value</em> across renders, only
          recalculating it when its dependencies change. Two payoffs:
          skipping expensive work, and keeping object/array identities
          stable for downstream memoization.
        </p>
      </div>

      <Demo
        title="1. Skip expensive recomputation"
        explanation="A synchronous prime-counting loop only reruns when the input N changes, not on unrelated re-renders."
      >
        <ExpensiveComputationDemo />
      </Demo>

      <Demo
        title="2. Referential stability for objects/arrays"
        explanation={
          <>
            Same idea as <code>useCallback</code>, but for a value instead
            of a function. A plain <code>{"{ ...} "}</code> literal is a new
            object every render, which defeats a memoized child even if its
            contents are identical.
          </>
        }
      >
        <ReferentialStabilityDemo />
      </Demo>

      <Demo
        title="3. Memoizing a derived/filtered list"
        explanation="Filtering 20,000 items is not free. Memoizing it means typing into an unrelated field on the same page doesn't re-run the filter."
      >
        <FilteredListDemo />
      </Demo>

      <Demo title="4. When NOT to use useMemo">
        <div className="callout">
          <code>useMemo(() =&gt; a + b, [a, b])</code> for a trivial
          addition is <strong>not</strong> worth it. <code>useMemo</code>{" "}
          still runs on every render to check its dependencies, still
          allocates a slot in React's internal state, and read/compare
          overhead can outweigh just recalculating a cheap expression.
          Reach for it when the computation is measurably expensive or you
          specifically need a stable reference &mdash; not as a reflexive
          wrapper around every derived value.
        </div>
      </Demo>
    </div>
  );
}
