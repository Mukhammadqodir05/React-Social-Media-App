import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from './Auth/signIn';
import SignUp from './Auth/signUp';
import Home from './components/HomeComponents/Home'
import Refresh from './components/HomeComponents/Refresh';

const App = () => {
  const [currentPage, setCurrentPage] = useState('SignUp');
  const switchForm = (FormSwitch) => setCurrentPage(FormSwitch);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user) {
      setCurrentPage('Home');
    }
  }, [loading, user]);

  return (
    <main className='flex w-full items-center justify-center h-screen mainBg text-white overflow-hidden'>
      {loading ? (
       <Refresh />
      ) : user ? (
        <Home />
      ) : currentPage === 'SignUp' ? (
        <SignUp onFormSwitch={switchForm} />
      ) : (
        <SignIn onFormSwitch={switchForm} />
      )}
    </main>
  );
};

export default App;