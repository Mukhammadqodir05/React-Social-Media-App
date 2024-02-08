import React from 'react';
import SideBar from './sideBar';
import BottomBar from './bottomBar';
import RightSideBar from '../ProfileComponents/rightSidebar';
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
          <div className='w-full homeFeed max-w-[650px] borderBg border-l border-r'>
            <HomeFeed />
          </div>
          <div className='hidden pl-6 RightSideBar'>
            <RightSideBar />
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

