import { createRoot } from 'react-dom/client'
import '@/index.css'
import AboutPage from '@/AboutPage'
import AppPortfolio from '@/AppPortfolio'

const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
const App = pathname === '/about' ? AboutPage : AppPortfolio

createRoot(document.getElementById('root')!).render(<App />)
