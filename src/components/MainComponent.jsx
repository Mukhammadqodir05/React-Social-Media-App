import React from 'react'
import SideBar from './sideBar'
import BottomBar from './bottomBar'
import ProfileAccounts from './profileAccounts'
import HomeFeed from './homeFeed'

const MainComponent = () => {
  return (
    <main className='flex  flex-row justify-center w-full h-screen overflow-hidden'>
    <div className='sideBarResize lg:w-[30%]'>
      <SideBar />
    </div>
    <div className='lg:w-2/4 max-w-[650px] borderBg border-l border-r w-full overflow-y-auto'>
     <HomeFeed />
    </div>
    <div className='lg:w-[30%] hidden lg:flex'>
      <ProfileAccounts />
    </div>
    <BottomBar />
  </main>
  )
}

export default MainComponent