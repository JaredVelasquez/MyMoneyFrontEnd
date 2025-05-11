import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configurar variable de entorno para la API
if (!import.meta.env.VITE_API_URL) {
  window.__API_URL__ = 'http://localhost:8080';
} else {
  window.__API_URL__ = import.meta.env.VITE_API_URL;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Declaración para TypeScript
declare global {
  interface Window {
    __API_URL__: string;
  }
}
