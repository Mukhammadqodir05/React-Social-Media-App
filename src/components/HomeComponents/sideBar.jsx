import React, { useState, useEffect } from "react";
import { Link, NavLink } from 'react-router-dom';
import { FaPlusSquare, FaFacebookMessenger, FaBell } from 'react-icons/fa';
import { AiFillHome } from "react-icons/ai";
import LogOut from '../../Auth/logout';
import Trendmedia from '/src/assets/Trendmedia.png';
import { useUserData } from '../../getUserData';
import { IoPersonCircleSharp } from "react-icons/io5";

const SideBar = () => {
  const { userProfile } = useUserData();
  const [userName, setUserName] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userProfile && userProfile.length > 0) {
      setUserName(userProfile[0].userName);
    }
  }, [userProfile]);

  const handleLogoClick = () => {
    window.location.reload();
    window.location.href = ("/");
  }

  setTimeout(() => {
    setMessage('');
  }, 1000);

  return (
    <main className="md:flex flex-col w-full h-screen">
      <ul className='flex flex-col items-center p-3 w-full pt-10'>
        <li className="flex gap-5 cursor-pointer">
          <img src={Trendmedia} title='Trendmedia' onClick={handleLogoClick} className='w-[70px] sidebarLogo' />
          <h1 title='Trendmedia' onClick={handleLogoClick} className="sidebarText font-serif ml-3 font-extrabold text-3xl gradient-text">Trendmedia</h1>
        </li>
        <div className='grid gap-5 mt-[30px]'>
          <NavLink to="/" className='rounded-full' activeclassname="active">
            <li className="flex gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              <AiFillHome size={30} className="cursor-pointer" />
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Home</span>
            </li>
          </NavLink>
          <div onClick={() => setMessage("This feature is coming soon!")} className='rounded-full'>
            <li className="flex gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              <FaFacebookMessenger size={25} className="cursor-pointer" />
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Messages</span>
            </li>
          </div>
          <NavLink to={`/${userName}/post`} className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              <FaPlusSquare size={27} className="cursor-pointer" />
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Post</span>
            </li>
          </NavLink>
          <div onClick={() => setMessage("This feature is coming soon!")} className='rounded-full'>
            <li className="flex gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              <FaBell size={27} className="cursor-pointer" />
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Notifications</span>
            </li>
          </div>
          <Link to={`/${userName}`} className='rounded-full' activeclassname='active'>
            <li className="flex items-center gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              {userProfile[0]?.userPictureURL ? 
                <img
                  className="w-full bg-black object-cover aspect-square h-full max-h-10 max-w-10 rounded-full border-2 border-white"
                  src={userProfile[0]?.userPictureURL}
                /> :  
                <div className='rounded-full bg-gray-300 flex items-center justify-center mr-2'>
                  <IoPersonCircleSharp size={36}/>
                </div>
              }
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Profile</span>
            </li>
          </Link>
          <div className='mt-[180px] p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full'>
            <LogOut />
          </div>
        </div>
      </ul>
      { message && 
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-60 z-50">
          <h1 className="font-extrabold font-serif text-2xl">{message}</h1>
        </div> 
      }
    </main>
  );
};

export default SideBar;