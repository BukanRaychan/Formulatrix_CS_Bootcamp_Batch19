import { useState } from "react";
import "./App.css";
import { UseStateDemo } from "./pages/UseStateDemo";
import { UseEffectDemo } from "./pages/UseEffectDemo";
import { UseCallbackDemo } from "./pages/UseCallbackDemo";
import { UseMemoDemo } from "./pages/UseMemoDemo";
import { UseRefDemo } from "./pages/UseRefDemo";

const PAGES = {
  useState: { label: "useState", component: UseStateDemo },
  useEffect: { label: "useEffect", component: UseEffectDemo },
  useCallback: { label: "useCallback", component: UseCallbackDemo },
  useMemo: { label: "useMemo", component: UseMemoDemo },
  useRef: { label: "useRef", component: UseRefDemo },
} as const;

type PageKey = keyof typeof PAGES;

function App() {
  const [active, setActive] = useState<PageKey>("useRef");
  const ActivePage = PAGES[active].component;

  return (
    <div className="app-shell">
      <nav className="sidebar">
        <h1>Hooks Playground</h1>
        <ul>
          {(Object.keys(PAGES) as PageKey[]).map((key) => (
            <li key={key}>
              <button
                className={key === active ? "nav-btn active" : "nav-btn"}
                onClick={() => setActive(key)}
              >
                {PAGES[key].label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="content">
        <ActivePage />
      </main>
    </div>
  );
}

export default App;
