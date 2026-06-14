import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Use the environment variable if set, otherwise fallback to deployed backend URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://event-sphere-ecru.vercel.app';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
