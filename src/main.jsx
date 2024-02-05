import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GetUserData } from './getUserData.jsx';
import MainProfileRoute from './components/ProfileComponents/mainRoute.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const LazyPost = React.lazy(() => import('./components/sideBarPages/posts.jsx'));
const LazyUpdateProfile = React.lazy(() => import('./components/ProfileComponents/updateProfile.jsx'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GetUserData>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:username" element={<MainProfileRoute />} />
        <Route path="/:username/edit" element={<Suspense fallback={<div>Loading...</div>}><LazyUpdateProfile /></Suspense>} />
        <Route path="/:username/post" element={<Suspense fallback={<div>Loading...</div>}><LazyPost /></Suspense>} />
      </Routes>
    </GetUserData>
  </BrowserRouter>,
);
