import { useCallback, useState } from "react";

export function useLog() {
  const [entries, setEntries] = useState<string[]>([]);
  const add = useCallback(
    (text: string) =>
      setEntries((prev) => [
        ...prev.slice(-19),
        `${new Date().toLocaleTimeString()} ${text}`,
      ]),
    [],
  );
  return { entries, add };
}
