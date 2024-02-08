import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GetUserData } from './getUserData.jsx';
import MainProfileRoute from './components/ProfileComponents/mainRoute.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Posts from './components/sideBarPages/posts.jsx';
import UpdateProfile from './components/ProfileComponents/updateProfile.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GetUserData>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:username" element={<MainProfileRoute />} />
        <Route path="/:username/edit" element={<UpdateProfile />} />
        <Route path="/:username/post" element={<Posts />} />
      </Routes>
    </GetUserData>
  </BrowserRouter>,
);
