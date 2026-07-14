import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode is deliberately omitted here: it double-invokes effects and
// component bodies in development specifically to surface missing cleanup
// bugs, which would double every render/effect counter these demos exist
// to show you accurately. Keep it on in real apps.
createRoot(document.getElementById('root')!).render(<App />)
