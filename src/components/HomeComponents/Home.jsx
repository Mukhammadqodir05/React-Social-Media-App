import React from 'react';
import SideBar from './sideBar';
import BottomBar from './bottomBar';
import ProfileAccounts from '../ProfileComponents/profileAccounts';
import HomeFeed from './homeFeed';
import { useUserData } from '../../getUserData';
import Refresh from '../HomeComponents/Refresh';

const Home = () => {
  const { userProfile } = useUserData(); 

  return (
    <main className='flex flex-row justify-center w-full h-screen overflow-hidden'>
      {userProfile ? (
        <>
          <div className='sideBarResize '>
            <SideBar />
          </div>
          <div className='w-full max-w-[650px] borderBg border-l border-r overflow-y-auto'>
            <HomeFeed />
          </div>
          <div className='hidden profileAccounts'>
            <ProfileAccounts />
          </div>
          <BottomBar />
        </>
      ) : (
        <Refresh />
      )}
    </main>
  );
};

export default Home;

