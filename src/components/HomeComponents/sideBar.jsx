import React,{ useState,useEffect } from "react";
import {Link, NavLink} from 'react-router-dom';
import {FaPlusSquare, FaFacebookMessenger, FaBell } from 'react-icons/fa';
import {AiFillHome} from "react-icons/ai";
import LogOut from '../../Auth/logout';
import Interactify from '/src/assets/Interactify.png'
import { useUserData } from '../../getUserData'; 
import { IoPersonCircleSharp } from "react-icons/io5";

const SideBar = () => {
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
      <ul className='flex flex-col items-center p-3 w-full pt-10'>
        <li className="flex gap-5 cursor-pointer">
          <img src={Interactify} title='TrendMedia' onClick={handleLogoClick} className='w-full max-w-16 sidebarLogo'/>
          <h1 title='Interactify' onClick={handleLogoClick} className="sidebarText font-serif ml-3 font-extrabold text-3xl">Interactify</h1>
        </li>
        <div className='grid gap-5 mt-[30px]'>
        <NavLink to="/" className='rounded-full' activeclassname="active">
            <li className="flex gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              <AiFillHome size={30} className="cursor-pointer" />
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Home</span>
            </li>
          </NavLink>
          <NavLink to={`/${userName}/post`} className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              <FaPlusSquare size={27} className="cursor-pointer"/>
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Post</span>
            </li>
          </NavLink>
          <div className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              <FaFacebookMessenger size={25} className="cursor-pointer"/>
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Messages</span>
            </li>
          </div>
          <div className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
              <FaBell size={27} className="cursor-pointer"/>
              <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Notifications</span>
            </li>
          </div>
          <Link to={`/${userName}`}  className='rounded-full' activeclassname='active'>
          <li className="flex items-center gap-5 p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
            {userProfile[0]?.userPictureURL ? 
                 <img
                   className="w-full  bg-black object-cover aspect-square h-full max-h-10 max-w-10 rounded-full border-2 border-white"
                   src={userProfile[0]?.userPictureURL}
                /> :  <div className='rounded-full bg-gray-300 flex items-center justify-center mr-2 '><IoPersonCircleSharp size={36}/></div>
            }
            <span className="sidebarText text-xl font-medium font-serif cursor-pointer">Profile</span>
          </li>
        </Link>
          <div className='mt-[180px] p-3 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full'>
             <LogOut />
          </div>
        </div>
      </ul>
    </main>
  );
};

export default SideBar;

