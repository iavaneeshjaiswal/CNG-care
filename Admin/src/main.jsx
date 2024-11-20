import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {CombinedContextProvider} from './contexts/CombinedContextProvider'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <CombinedContextProvider>
    <App />
  </CombinedContextProvider>,
)
