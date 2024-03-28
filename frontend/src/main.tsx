import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import store from "@src/store/store.ts"
import { Provider } from 'react-redux'
import { CssBaseline, StyledEngineProvider } from '@mui/material'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store= {store}>
      
        <BrowserRouter>
          <HelmetProvider>
            <StyledEngineProvider injectFirst>
              <CssBaseline/>
              <App />  
            </StyledEngineProvider>
          </HelmetProvider>
        </BrowserRouter>
      
    </Provider>
  </React.StrictMode>,
)
