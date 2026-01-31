import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

// AOS başlat
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 100,
  delay: 100
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)