import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GetUserData } from './getUserData.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Posts from './components/sideBarPages/posts.jsx';
import UpdateProfile from './components/ProfileComponents/updateProfile.jsx';
import { PuffLoader } from 'react-spinners';
const App = lazy(() => import('./App.jsx'));
const MainProfileRoute = lazy(() => import('./components/ProfileComponents/mainRoute.jsx'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GetUserData>
      <Routes>
        <Route path="/" element={<Suspense fallback={<div className='flex w-full h-screen items-center justify-center'><PuffLoader size={200} color='#F9008E' loading={true} /></div>}><App /></Suspense>} />
        <Route path="/:username" element={<Suspense fallback={<div className='flex w-full h-screen items-center justify-center'><PuffLoader size={200} color='#F9008E' loading={true} /></div>}><MainProfileRoute /></Suspense>} />
        <Route path="/:username/edit" element={<UpdateProfile />} />
        <Route path="/:username/post" element={<Posts />} />
      </Routes>
    </GetUserData>
  </BrowserRouter>,
);
