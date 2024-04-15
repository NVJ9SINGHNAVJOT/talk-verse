import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import store from "@/store/store.ts";
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import consoleConfig from './config/console.ts';

consoleConfig(process.env.REACT_APP_ENVIRONMENT as string);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>

      <BrowserRouter>

        <HelmetProvider>
          <App />
          <Toaster />
        </HelmetProvider>

      </BrowserRouter>

    </Provider>
  </React.StrictMode>
);
