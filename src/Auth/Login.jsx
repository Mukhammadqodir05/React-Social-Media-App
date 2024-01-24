import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { BsPersonCircle } from 'react-icons/bs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {user, loginUser} = useAuth()
  const navigate = useNavigate()

  const loginForm = useRef(null)

  useEffect(() => {
    if (user){
      navigate('/')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = loginForm.current.email.value
    const password = loginForm.current.password.value
    
    const userInfo = {email, password}

    loginUser(userInfo)
  }

  return (
    <main className='flex justify-center items-center w-full h-screen AuthenticationPageBg p-3'>
     <div className='container w-full max-w-[320px] max-h-[530px] h-full flex items-center flex-col rounded-3xl p-4 relative'>
      <div className='space-y-2 text-sky-400'>
        <BsPersonCircle className='text-[110px] cursor-pointer' />
        <h1 className='text-center'>Sign In</h1>
       </div> 

          <form className='text-center space-y-[35px] text-white mt-[50px]' onSubmit={handleSubmit} ref={loginForm}> 
            <input 
              className='input border-b outline-none py-1 bg-transparent p-2 w-full max-w-[250px]'
              required
              type="email" 
              name="email"
              placeholder="Enter email..."
            />    
            <div className='relative'>
              <input 
                className='input border-b outline-none py-1 bg-transparent p-2 w-full max-w-[250px]'
                required
                type={showPassword? 'text' :'password'}
                name="password"
                placeholder="Enter password..."
                autoComplete="password"
                />
               <span
                className='absolute text-black right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'
                onClick={() => setShowPassword((prevShow) => !prevShow)}
              >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} 
              </span>
              </div>  
              <button
                type='submit'
                value='login'
                className='rounded-full px-20 py-2 text-white bg-[#2432cf] shadow-md hover:shadow-slate-500'
              >
                Sign In
              </button>  

            </form>
            <div className='absolute flex justify-between gap-2 mt-[465px] text-white'>
              <p>Already have an account?</p>
              <Link to='/Users-register' className='underline hover:underline'>
                Register
              </Link>
           </div>
        </div>
    </main>
  )
}

export default Login

