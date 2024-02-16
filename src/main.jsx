import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from '@descope/react-sdk';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider
      projectId={import.meta.env.VITE_DESCOPE_PROJECT_ID}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
