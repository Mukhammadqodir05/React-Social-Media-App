import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {GetUserData} from './getUserData.jsx'
import Post from './components/sideBarPages/post1.jsx'
import MainProfileRoute from './components/ProfileComponents/mainRoute.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UpdateProfile from './components/ProfileComponents/updateProfile.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <GetUserData>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post" element={<Post />} />
        <Route path="/:username" element={<MainProfileRoute />} />
        <Route path="/:username/edit" element={< UpdateProfile  />} />
    </Routes>
  </GetUserData>
 </BrowserRouter>,
)