# React Hooks Playground

An interactive, self-contained walkthrough of `useState`, `useEffect`, `useCallback`, `useMemo`, and `useRef` — one page per hook, each with several runnable demos instead of just prose. Built as part of Formulatrix CS Bootcamp Batch 19.

Note: `<StrictMode>` is intentionally left out of `main.tsx` here. It double-invokes effects and component bodies in development to help surface missing-cleanup bugs, which would double every render/effect counter these demos rely on to show an accurate number. Keep it on in real apps — it's off here purely so the counters mean what they say.

---

## Pages

### useState
1. Basic counter
2. Functional updates (`c => c + 1`) vs. direct values (`count + 1`) — why calling a setter multiple times in one handler behaves differently
3. Lazy initial state — `useState(expensiveInit())` re-runs the init function every render, `useState(() => expensiveInit())` runs it once
4. Why mutating state in place doesn't trigger a re-render

### useEffect
1. Empty dependency array — runs once on mount, cleans up once on unmount
2. How the dependency array decides what triggers a re-run
3. Cleanup functions preventing a leaked `setInterval`
4. Guarding an async effect against race conditions with an `ignore` flag

### useCallback
1. Referential stability: a memoized function prop vs. an inline arrow function, and the difference it makes to a `React.memo` child's render count
2. A debounced search handler that needs a stable identity

### useMemo
1. Skipping an expensive recomputation (a synchronous prime-counting loop) when unrelated state changes
2. Referential stability for an object/array passed to a memoized child
3. Memoizing a derived/filtered list so typing in an unrelated field doesn't re-run the filter
4. A callout on when *not* to bother with `useMemo`

### useRef — the deep dive
1. **The basic concept**: a ref is a plain `{ current: value }` box that survives re-renders, but mutating `.current` does not itself trigger one — demonstrated side-by-side against `useState`
2. DOM access: focus an element
3. DOM access: measure an element's size
4. Scroll behavior: scroll a specific list item into view
5. Scroll behavior: a live scroll-position readout written directly to a DOM node, bypassing React re-renders entirely
6. Storing a mutable value: the classic `usePrevious` pattern
7. Keeping a `setInterval` id alive across renders (a stopwatch)
8. The "latest ref" pattern for avoiding stale closures in long-lived callbacks
9. Imperative child APIs via `useImperativeHandle` — a parent commanding a child directly instead of describing its state through props

---

## Running

```bash
npm install
npm run dev
```

Serves on `http://localhost:5173`. No backend required.
