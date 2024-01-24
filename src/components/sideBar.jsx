import React from 'react';
import {NavLink} from 'react-router-dom';
import {FaSignOutAlt, FaSearch, FaPlusSquare, FaCompass, FaUser, FaFacebookMessenger, FaBell } from 'react-icons/fa';
import {AiFillHome} from "react-icons/ai";
import LogOut from './logout';

const SideBar = () => {


  const handleLogoClick = () =>{
    window.location.reload();
    window.location.href = ("/");
  }

  return (
    <main className=" md:flex flex-col w-full h-screen">
      <ul className='flex flex-col items-center p-6 w-full mt-[10px]'>
        <li className="flex gap-5 cursor-pointer">
          <h1 title='Trendnet' onClick={handleLogoClick} className='text-3xl sm:hidden font-serif font-medium'>𝑻</h1>
          <h1 title='Trendnet' onClick={handleLogoClick} className="hidden text-3xl sm:flex">𝓣𝓻𝓮𝓷𝓭𝓷𝓮𝓽</h1>
        </li>
        <div className='grid gap-5 mt-[60px]'>
        <NavLink to="/" className='rounded-md' activeclassname="active">
            <li className="flex gap-5 p-2">
              <AiFillHome size={30} className="cursor-pointer" />
              <span className="hidden text-xl font-medium font-serif sm:flex cursor-pointer">Home</span>
            </li>
          </NavLink>
          <NavLink to="/post" className='rounded-md' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaPlusSquare size={27} className="cursor-pointer"/>
              <span className="hidden text-xl font-medium font-serif sm:flex cursor-pointer">Post</span>
            </li>
          </NavLink>
          <NavLink to="/explore" className='rounded-md' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaCompass size={27} className="cursor-pointer"/>
              <span className="hidden text-xl font-medium font-serif sm:flex cursor-pointer">Explore</span>
            </li>
          </NavLink>
          <NavLink to="/messages" className='rounded-md' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaFacebookMessenger size={25} className="cursor-pointer"/>
              <span className="hidden text-xl font-medium font-serif sm:flex cursor-pointer">Messages</span>
            </li>
          </NavLink>
          <NavLink to="/notifications" className='rounded-md' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaBell size={27} className="cursor-pointer"/>
              <span className="hidden text-xl font-medium font-serif sm:flex cursor-pointer">Notifications</span>
            </li>
          </NavLink>
          <NavLink to="/username" className='rounded-md' activeclassname='active'>
          <li className="flex gap-5 p-2">
            <FaUser size={27} className="cursor-pointer"/>
            <span className="hidden text-xl font-medium font-serif sm:flex cursor-pointer">Profile</span>
          </li>
        </NavLink>
          <div className='mt-[150px]' >
             <LogOut />
          </div>
        </div>
      </ul>
    </main>
  );
};

export default SideBar;

