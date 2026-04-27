import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Admin } from './pages/Admin'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')

const isAdminRoute = window.location.pathname.replace(/\/$/, '') === '/admin'

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>{isAdminRoute ? <Admin /> : <App />}</ErrorBoundary>
  </StrictMode>,
)
