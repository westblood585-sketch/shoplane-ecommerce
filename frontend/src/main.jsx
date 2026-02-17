import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ChatProvider } from './contexts/ChatContext.jsx'
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

const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <BrowserRouter future={routerFutureFlags}>
            <ChatProvider>
              <App />
            </ChatProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      ) : (
        <BrowserRouter future={routerFutureFlags}>
          <ChatProvider>
            <App />
          </ChatProvider>
        </BrowserRouter>
      )}
    </HelmetProvider>
  </React.StrictMode>
)