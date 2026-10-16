import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx'
import PublicOfferPage from './pages/PublicOfferPage.tsx'
import OrderCompletePage from './pages/OrderCompletePage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/offer" element={<PublicOfferPage />} />
        <Route path="/order-complete" element={<OrderCompletePage />} />
      </Routes>
    </BrowserRouter>
  )
}
