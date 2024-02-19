import React, { useState,useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaPlusSquare, FaBell, FaFacebookMessenger } from 'react-icons/fa';
import {AiFillHome} from "react-icons/ai";
import { useUserData } from '../../getUserData'; 
import { IoPersonCircleSharp } from "react-icons/io5";

const BottomBar = () => {
  const { userProfile } = useUserData(); 
  const [userName, setUserName] = useState(null)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    if (userProfile && userProfile.length > 0) {
      setUserName(userProfile[0].userName);
    }
  }, [userProfile]);

  setTimeout(() =>{
    setMessage('')
  }, [1000])
         
  return (
    <main className="fixed z-10 BottomBar bottom-0 left-0 w-full border-t text-white bg-[#3a1450] borderBg">
      <ul className='flex items-center p-3 w-full h-[60px] justify-around space-x-2'>
       <NavLink to="/" className='rounded-full' activeclassname="active">
            <li className="flex p-2">
              <AiFillHome size={27} className="cursor-pointer" />
            </li>
          </NavLink>
          <div onClick={()=> setMessage("This feature is coming soon!")} className='rounded-full'>
            <li className="flex p-2">
              <FaFacebookMessenger size={25} className="cursor-pointer"/>
            </li>
          </div>
          <NavLink to={`/${userName}/post`} className='rounded-full' activeclassname='active'>
            <li className="flex p-2">
              <FaPlusSquare size={27} className="cursor-pointer"/>
            </li>
          </NavLink>
          <div onClick={()=> setMessage("This feature is coming soon!")} className='rounded-full'>
            <li className="flex p-2">
              <FaBell size={27} className="cursor-pointer"/>
            </li>
          </div>
          <Link to={`/${userName}`}  className='rounded-full' activeclassname='active'>
          <li className="flex rounded-full">
            {userProfile[0]?.userPictureURL ? 
                 <img
                   className="bg-black object-cover aspect-square h-10 w-10 rounded-full border-2 border-white"
                   src={userProfile[0]?.userPictureURL}
                /> : 
                <div className='rounded-full bg-gray-300 flex items-center justify-center mr-2 '><IoPersonCircleSharp size={36}/></div>
            }
          </li>
        </Link>
        </ul>
        { message && 
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-60 z-50">
          <h1 className="font-extrabold font-serif text-2xl">{message}</h1>
        </div> 
      }
    </main>
   );
};   

export default BottomBar