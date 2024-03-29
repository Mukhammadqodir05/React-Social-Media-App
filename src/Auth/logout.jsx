import React from 'react'
import {auth} from '../firebase'
import {FaSignOutAlt } from 'react-icons/fa';


const LogOut = () => {
         
const signOut = () => {
    signOut(auth)
}

  return (
    <button className="flex gap-5" onClick={() => auth.signOut()} >
    <FaSignOutAlt size={27} className="cursor-pointer"/>
    <span className="sidebarText text-xl cursor-pointer font-medium font-serif">Log out</span>
  </button>
  )
}

export default LogOut