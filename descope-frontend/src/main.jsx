import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from '@descope/react-sdk';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider
      projectId='P2akLIXEBJz0AtAEbPVEzQ2YTSXV'
    >
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
