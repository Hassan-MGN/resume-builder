import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/AppErrorBoundary.jsx'
import { reportError } from './utils/telemetry'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'

if (import.meta.env.DEV) {
  document.documentElement.setAttribute("data-resummetry-local", "true");

  // Vercel can inject its collaboration toolbar outside the React tree during
  // `vercel dev`. It is development chrome, not part of Resummetry, so remove
  // it when it appears and keep watching for hot-reload reinsertion.
  const removeVercelChrome = () => {
    const selectors = [
      "[data-vercel-toolbar]",
      "#vercel-toolbar",
      "vercel-live-feedback",
      "nextjs-portal",
      "[id*='vercel-toolbar']",
      "[class*='vercel-toolbar']",
    ];
    document.querySelectorAll(selectors.join(",")).forEach((node) => node.remove());
  };

  removeVercelChrome();
  const vercelChromeObserver = new MutationObserver(removeVercelChrome);
  vercelChromeObserver.observe(document.documentElement, { childList: true, subtree: true });
}


window.addEventListener('error', (event) => reportError(event.error || event.message, { source: 'window' }));
window.addEventListener('unhandledrejection', (event) => reportError(event.reason, { source: 'unhandledrejection' }));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
    </AuthContextProvider>
  </StrictMode>,
)
