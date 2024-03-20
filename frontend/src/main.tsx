import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <CssBaseline/>
          <App />  
        </HelmetProvider>
      </BrowserRouter>
  </React.StrictMode>,
)
