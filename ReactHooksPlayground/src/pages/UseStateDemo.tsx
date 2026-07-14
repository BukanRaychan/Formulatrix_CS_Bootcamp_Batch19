import { useRef, useState } from "react";
import { Demo } from "../components/Demo";

function BasicCounter() {
  const [count, setCount] = useState(0);
  return (
    <div className="row">
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <span className="big-number">{count}</span>
    </div>
  );
}

function FunctionalUpdater() {
  const [direct, setDirect] = useState(0);
  const [functional, setFunctional] = useState(0);

  const tripleDirect = () => {
    // Each call closes over the SAME `direct` value captured when this
    // handler was created for this render, so all three calls compute
    // `direct + 1` from the same starting number.
    setDirect(direct + 1);
    setDirect(direct + 1);
    setDirect(direct + 1);
  };

  const tripleFunctional = () => {
    // Each updater receives the latest pending state, so the three calls
    // chain correctly instead of clobbering each other.
    setFunctional((c) => c + 1);
    setFunctional((c) => c + 1);
    setFunctional((c) => c + 1);
  };

  return (
    <div className="compare-grid">
      <div className="compare-col">
        <h3>
          <code>setDirect(direct + 1)</code> x3
        </h3>
        <button onClick={tripleDirect}>Call setter 3x</button>
        <p className="big-number">{direct}</p>
        <p className="hint">
          Ends up <span className="bad">+1</span> per click, not +3.
        </p>
      </div>
      <div className="compare-col">
        <h3>
          <code>setFunctional(c =&gt; c + 1)</code> x3
        </h3>
        <button onClick={tripleFunctional}>Call setter 3x</button>
        <p className="big-number">{functional}</p>
        <p className="hint">
          Ends up <span className="good">+3</span> per click, as expected.
        </p>
      </div>
    </div>
  );
}

function heavyCompute() {
  let total = 0;
  for (let i = 0; i < 2_000_000; i++) total += i;
  return total % 1000;
}

function LazyInitDemo() {
  const eagerCalls = useRef(0);
  const lazyCalls = useRef(0);
  const [, bumpTick] = useState(0);

  const [eagerValue] = useState(() => {
    // wrapping in an outer call just to count invocations for the demo
    return (() => {
      eagerCalls.current += 1;
      return heavyCompute();
    })();
  });
  const [lazyValue] = useState(() => {
    lazyCalls.current += 1;
    return heavyCompute();
  });

  return (
    <div>
      <div className="row">
        <button onClick={() => bumpTick((t) => t + 1)}>
          Force a re-render (unrelated state)
        </button>
      </div>
      <div className="compare-grid">
        <div className="compare-col">
          <h3>
            <code>useState(expensiveInit())</code>
          </h3>
          <p>Initial value: {eagerValue}</p>
          <p className="hint">
            Init function called: <strong>{eagerCalls.current}</strong> time(s)
            <span className="tag-bad" style={{ marginLeft: 6 }}>
              recomputes every render
            </span>
          </p>
        </div>
        <div className="compare-col">
          <h3>
            <code>useState(() =&gt; expensiveInit())</code>
          </h3>
          <p>Initial value: {lazyValue}</p>
          <p className="hint">
            Init function called: <strong>{lazyCalls.current}</strong> time(s)
            <span className="tag-good" style={{ marginLeft: 6 }}>
              only on mount
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ImmutableUpdateDemo() {
  const [items, setItems] = useState(["Buy milk", "Walk the dog"]);

  const addMutating = () => {
    // Pushes into the exact array currently in state, then hands that
    // identical reference back to setState. React bails out because
    // Object.is(oldState, newState) is true - it never even diffs.
    items.push(`Item ${items.length + 1}`);
    setItems(items);
  };

  const addCopying = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  return (
    <div className="compare-grid">
      <div className="compare-col">
        <h3>Mutate then setState</h3>
        <button onClick={addMutating}>Add item (buggy)</button>
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="hint bad">
          List won't visibly update - same array reference in, same
          reference out.
        </p>
      </div>
      <div className="compare-col">
        <h3>Copy then setState</h3>
        <button onClick={addCopying}>Add item (correct)</button>
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="hint good">New array reference every time - React sees the change.</p>
      </div>
    </div>
  );
}

export function UseStateDemo() {
  return (
    <div>
      <div className="page-intro">
        <h1>useState</h1>
        <p>
          Lets a component hold a value that, when changed, triggers a
          re-render. The pitfalls below all come from misunderstanding{" "}
          <em>when</em> the value updates and <em>which</em> value a closure
          captured.
        </p>
      </div>

      <Demo
        title="1. Basic counter"
        explanation="Calling the setter schedules a re-render with the new value."
      >
        <BasicCounter />
      </Demo>

      <Demo
        title="2. Functional updates vs. direct values"
        explanation={
          <>
            Calling a setter multiple times in one handler using the current
            variable (<code>direct + 1</code>) uses a value frozen at render
            time. The functional form (<code>c =&gt; c + 1</code>) always
            receives the latest pending state, so repeated calls stack
            correctly.
          </>
        }
      >
        <FunctionalUpdater />
      </Demo>

      <Demo
        title="3. Lazy initial state"
        explanation={
          <>
            <code>useState(expensiveInit())</code> calls{" "}
            <code>expensiveInit</code> on every render (only the first
            result is kept) &mdash; wasted work. Passing the function itself,{" "}
            <code>useState(() =&gt; expensiveInit())</code>, only calls it
            once, on mount.
          </>
        }
      >
        <LazyInitDemo />
      </Demo>

      <Demo
        title="4. Don't mutate state directly"
        explanation={
          <>
            React decides whether to re-render by checking if the new state
            is a different reference than the old one. Mutating an array/object
            in place and passing the same reference back means React sees
            "nothing changed."
          </>
        }
      >
        <ImmutableUpdateDemo />
      </Demo>
    </div>
  );
}
