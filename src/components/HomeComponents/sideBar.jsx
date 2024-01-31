import React,{ useState,useEffect } from "react";
import {NavLink} from 'react-router-dom';
import {FaPlusSquare, FaCompass, FaUser, FaFacebookMessenger, FaBell } from 'react-icons/fa';
import {AiFillHome} from "react-icons/ai";
import LogOut from '../../Auth/logout';
import TrendMedia from '/src/assets/TrendMedia.png'
import { useParams } from 'react-router-dom';
import { useUserData } from '../../getUserData'; 


const SideBar = () => {
  const {username} = useParams()
  const { userProfile } = useUserData(); 
  const [userName, setUserName] = useState(null)
  
  useEffect(() => {
    if (userProfile && userProfile.length > 0) {
      setUserName(userProfile[0].userName);
    }
  }, [userProfile]);

   
  const handleLogoClick = () =>{
    window.location.reload();
    window.location.href = ("/");
  }

  

  return (
    <main className=" md:flex flex-col w-full h-screen">
      <ul className='flex flex-col items-center p-6 w-full mt-[10px]'>
        <li className="flex gap-5 cursor-pointer">
          <img src={TrendMedia} title='Trendnet' onClick={handleLogoClick} className='w-full max-w-20 sm:hidden' />
          <h1 title='Trendnet' onClick={handleLogoClick} className="hidden ml-10 text-3xl sm:flex">𝓣𝓻𝓮𝓷𝓭𝓜𝓮𝓭𝓲𝓪</h1>
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
          <NavLink to={`/${userName}`}  className='rounded-md' activeclassname='active'>
          <li className="flex gap-5 p-2">
            <FaUser size={27} className="cursor-pointer"/>
            <span className="hidden text-xl font-medium font-serif sm:flex cursor-pointer">Profile</span>
          </li>
        </NavLink>
          <div className='mt-[150px] p-2' >
             <LogOut />
          </div>

        </div>
      </ul>
    </main>
  );
};

export default SideBar;

