import { useRef } from "react";

// A ref survives across re-renders without resetting like a local variable
// would, and mutating .current does NOT itself trigger a re-render - which
// is exactly why this is safe to do directly in the render body: it just
// counts renders that were going to happen anyway, instead of causing them.
export function useRenderCount() {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
}
