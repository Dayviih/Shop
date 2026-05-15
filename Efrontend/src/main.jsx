import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import ShopContextProvider from './Context/ShopContext.jsx'
import ToastProvider from './Context/ToastContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShopContextProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ShopContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)