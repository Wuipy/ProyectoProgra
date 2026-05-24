import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const contenedor = document.getElementById('root')

if (contenedor) {
  createRoot(contenedor).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
