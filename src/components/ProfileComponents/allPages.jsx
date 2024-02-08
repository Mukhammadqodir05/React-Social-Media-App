import React from 'react'
import SideBar from '../HomeComponents/sideBar'
import Profile from './profile'
import RightSideBar from './rightSidebar'
import BottomBar from '../HomeComponents/bottomBar'
import { useUserData } from '../../getUserData'
import Refresh from '../HomeComponents/Refresh'

const AllPages = () => {
  const { userProfile } = useUserData(); 
 
  return (
    <main className='flex flex-row justify-center w-full h-screen overflow-hidden'>
        {userProfile ? (
          <>
            <div className='sideBarResize'>
              <SideBar />
            </div>
            <div className='max-w-[650px] borderBg border-l border-r w-full'>
              <Profile />
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
}

export default AllPages;
