import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const LogOut = () => {
    const navigate = useNavigate()
    const {user, logoutUser} = useAuth()

    const logoutClick = () => {
        navigate('/login')
    }

  return (
         <div className="header">
         <div className="links--wrapper">
             {user ? (
             <>
                 <button onClick={logoutUser} className="btn">Logout</button>
             </>
             ):(
                 <Link className="btn" to="/login">Login</Link>
             )}
             
         </div>
     </div>
  )
}

export default LogOut