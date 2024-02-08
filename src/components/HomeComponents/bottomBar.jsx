import React,{useState,useEffect} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaPlusSquare, FaBell } from 'react-icons/fa';
import {AiFillHome} from "react-icons/ai";
import { useUserData } from '../../getUserData'; 
import { IoPersonCircleSharp } from "react-icons/io5";

const BottomBar = () => {
  const { userProfile } = useUserData(); 
  const [userName, setUserName] = useState(null)
  
  useEffect(() => {
    if (userProfile && userProfile.length > 0) {
      setUserName(userProfile[0].userName);
    }
  }, [userProfile]);
         
  return (
     <main className="fixed z-10 BottomBar bottom-0 left-0 w-full border-t flex justify-around space-x-2 p-2 text-white bg-[#3a1450] borderBg">
       <NavLink to="/" className='rounded-full' activeclassname="active">
            <li className="flex gap-5 p-2">
              <AiFillHome size={27} className="cursor-pointer" />
            </li>
          </NavLink>
          <NavLink to={`/${userName}/post`} className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaPlusSquare size={27} className="cursor-pointer"/>
            </li>
          </NavLink>
          <div className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaBell size={27} className="cursor-pointer"/>
            </li>
          </div>
          <Link to={`/${userName}`}  className='rounded-full' activeclassname='active'>
          <li className="flex gap-5 hover:bg-[#2f2d2d] hover:bg-opacity-70 rounded-full">
            {userProfile[0]?.userPictureURL ? 
                 <img
                   className="w-full  bg-black object-cover aspect-square h-full max-h-10 max-w-10 rounded-full border-2 border-white"
                   src={userProfile[0]?.userPictureURL}
                /> : 
                <div className='rounded-full bg-gray-300 flex items-center justify-center mr-2 '><IoPersonCircleSharp size={36}/></div>
            }
          </li>
        </Link>
    </main>
   );
};   

export default BottomBar