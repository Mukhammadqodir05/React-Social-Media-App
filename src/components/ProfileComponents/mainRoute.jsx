import React from 'react';
import AllPages from './allPages';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import Refresh from '../HomeComponents/Refresh';

const MainProfileRoute = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <main className='flex w-full items-center justify-center h-screen mainBg text-white overflow-hidden'>
      {loading ? (
        <Refresh />
      ) : user ? (
        <AllPages />
      ) : (
        <Navigate to="/" /> 
      )}
    </main>
  );
};

export default MainProfileRoute;
