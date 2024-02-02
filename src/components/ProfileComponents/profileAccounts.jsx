import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaSearch, FaPlusSquare, FaCompass, FaUser, FaFacebookMessenger, FaBell } from 'react-icons/fa';

const ProfileAccounts = () => {

  const handleLogoClick = () =>{
    window.location.reload();
    window.location.href = ("/");
  }

  return (
    <main className="md:flex flex-col w-full h-screen ">
      <ul className='flex flex-col items-center rounded-md p-6 w-full mt-[10px]'>
        <li className="flex gap-5 cursor-pointer">
          <h1 title='Trendnet' onClick={handleLogoClick} className='text-2xl sm:hidden font-serif font-medium'>𝑻</h1>
          <h1 title='Trendnet' onClick={handleLogoClick} className="hidden text-2xl sm:flex">𝓣𝓻𝓮𝓷𝓭𝓷𝓮𝓽</h1>
        </li>
        <div className='grid gap-10 mt-[60px]'>
          <Link to="/">
            <li className="flex gap-5 ">
              <FaHome size={25} className="cursor-pointer"/>
              <span className="hidden font-medium font-serif sm:flex cursor-pointer">Home</span>
            </li>
          </Link>
          <Link to="/search">
            <li className="flex gap-5 ">
              <FaSearch size={25} className="cursor-pointer"/>
              <span className="hidden font-medium font-serif sm:flex cursor-pointer">Search</span>
            </li>
          </Link>
          <Link to="/post">
            <li className="flex gap-5 ">
              <FaPlusSquare size={25} className="cursor-pointer"/>
              <span className="hidden font-medium font-serif sm:flex cursor-pointer">Post</span>
            </li>
          </Link>
          <Link to="/explore">
            <li className="flex gap-5 ">
              <FaCompass size={25} className="cursor-pointer"/>
              <span className="hidden font-medium font-serif sm:flex cursor-pointer">Explore</span>
            </li>
          </Link>
          <Link to="/messages">
            <li className="flex gap-5">
              <FaFacebookMessenger size={25} className="cursor-pointer"/>
              <span className="hidden font-medium font-serif sm:flex cursor-pointer">Messages</span>
            </li>
          </Link>
          <Link to="/notifications">
            <li className="flex gap-5">
              <FaBell size={25} className="cursor-pointer"/>
              <span className="hidden font-medium font-serif sm:flex cursor-pointer">Notifications</span>
            </li>
          </Link>
          <Link to="/username">
          <li className="flex gap-5">
            <FaUser size={25} className="cursor-pointer"/>
            <span className="hidden font-medium font-serif sm:flex cursor-pointer">Profile</span>
          </li>
         </Link>
          <div className='mt-[100px]'>
             <li className="flex gap-5">
              <FaSignOutAlt size={22} className="cursor-pointer"/>
              <span className="hidden cursor-pointer font-medium font-serif sm:flex">Log out</span>
            </li>
          </div>
        </div>
      </ul>
    </main>
  );
};

export default ProfileAccounts;
