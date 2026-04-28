import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Admin } from './pages/Admin'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')

const path = window.location.pathname.replace(/\/$/, '')

const route = (() => {
  if (path === '/admin') return <Admin />
  if (path === '/privacy') return <Privacy />
  if (path === '/terms') return <Terms />
  return <App />
})()

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>{route}</ErrorBoundary>
  </StrictMode>,
)
