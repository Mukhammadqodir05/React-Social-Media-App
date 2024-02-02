import React,{useState,useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlusSquare, FaCompass, FaUser, FaBell } from 'react-icons/fa';
import {AiFillHome} from "react-icons/ai";
import { useUserData } from '../../getUserData'; 

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
          <NavLink to="/explore" className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaCompass size={27} className="cursor-pointer"/>
            </li>
          </NavLink>
          <NavLink to="/post" className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaPlusSquare size={27} className="cursor-pointer"/>
            </li>
          </NavLink>
          <NavLink to="/notifications" className='rounded-full' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaBell size={27} className="cursor-pointer"/>
            </li>
          </NavLink>
          <NavLink to={`/${userName}`} className='rounded-full' activeclassname='active'>
          <li className="flex gap-5 p-2">
            <FaUser size={27} className="cursor-pointer"/>
          </li>
        </NavLink>
    </main>
   );
};   

export default BottomBar