import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import LandingPage from './views/LandingPage.jsx'
import FallbackPage from './views/FallbackPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/poll/:id" element={<FallbackPage />} />
        <Route path="/profile/:username" element={<FallbackPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
