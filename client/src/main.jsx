import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' 
import './index.css'
import { CartProvider } from './context/CartContext'
// FIXED: Updated the path to point to AuthContext instead of AuthProvider
import { AuthProvider } from './context/AuthContext' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> 
      {/* AuthProvider must wrap CartProvider so useCart can safely access useAuth */}
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)