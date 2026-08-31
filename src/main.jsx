import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const container = document.getElementById('root') || (() => {
  const el = document.createElement('div')
  el.id = 'root'
  document.body.insertBefore(el, document.body.firstChild)
  return el
})()

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
