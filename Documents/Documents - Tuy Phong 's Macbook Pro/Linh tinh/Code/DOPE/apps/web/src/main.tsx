import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

// Get root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

// Mount app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)

