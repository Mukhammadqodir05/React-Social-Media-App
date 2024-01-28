import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Profiles from './components/ProfileRoute/profile_route.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
   
  <BrowserRouter>
  <Routes>
      <Route path="/" element={<App />} />
      <Route path="/username" element={<Profiles />} />
   </Routes>
 </BrowserRouter>,
)