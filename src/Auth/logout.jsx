import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import {FaSignOutAlt } from 'react-icons/fa';

const LogOut = () => {
    const navigate = useNavigate()
    const {user, logoutUser} = useAuth()

    const logoutClick = () => {
        navigate('/Users-login')
    }

  return (
    <div className="">
            {user ? (
            <>
              <button className="flex gap-5" onClick={logoutUser} >
                <FaSignOutAlt size={27} className="cursor-pointer"/>
                <span className="hidden text-xl cursor-pointer font-medium font-serif sm:flex">Log out</span>
              </button>
            </>
            ):(
                <Link className="btn" to="/login">Login</Link>
            )}
    </div>
  )
}

export default LogOut