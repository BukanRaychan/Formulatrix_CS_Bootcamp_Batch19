# SignalR Feature Tour — Frontend

React + Vite + TypeScript client for the [SignalRDemoApi](../SignalRDemoApi) backend, built to show off every messaging pattern ASP.NET Core SignalR supports.

---

## How it's wired

- `src/hooks/useDemoHub.ts` owns the single `signalR.HubConnection` for the tab: it builds the connection (with `withAutomaticReconnect`), registers a listener for every event the hub can push, and exposes typed action functions (`sendToAll`, `joinGroup`, `startCounterStream`, ...) that call hub methods with `connection.invoke` / `.send` / `.stream`.
- `src/App.tsx` gates the app behind a username prompt, then lays out one panel per feature.
- Each `src/components/*Panel.tsx` is a thin view over a slice of the hook's state — no panel talks to the connection directly.

## Try the multi-user features

Most of what's interesting here (presence, broadcast scopes, groups, private messages) only becomes obvious with **two connections**. Open the app in two tabs (or one normal + one incognito window) with different usernames and watch them react to each other live.

## Running

```bash
npm install
npm run dev
```

Serves on `http://localhost:5173`. Requires the backend running on `http://localhost:5066` (see [SignalRDemoApi](../SignalRDemoApi)).
