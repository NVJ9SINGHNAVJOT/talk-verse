import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import store from "@src/store/store.ts"
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store= {store}>
      <BrowserRouter>
        <HelmetProvider>
          <CssBaseline/>
          <App />  
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
