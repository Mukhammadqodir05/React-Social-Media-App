import React, {useState,useEffect, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { BsPersonCircle } from 'react-icons/bs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const registerForm = useRef(null)
  const {user, registerUser} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user){
      navigate('/')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const name = registerForm.current.name.value
    const email = registerForm.current.email.value
    const password1 = registerForm.current.password1.value
    const password2 = registerForm.current.password2.value

    if(password1 !== password2){
        alert('Passwords did not match!')
        return 
    }
    
    const userInfo = {name, email, password1, password2}

    registerUser(userInfo)
}

  return (
    <main className='flex justify-center items-center w-full h-screen AuthenticationPageBg p-3'>
      <div className='container w-full max-w-[320px] max-h-[530px] h-full flex items-center flex-col rounded-3xl p-4 relative'>
        <div className='space-y-2 text-sky-400'>
          <BsPersonCircle className='text-[110px] cursor-pointer' />
          <h1 className='text-center'>Sign Up</h1>
         </div> 
          <form className='text-center space-y-[25px] text-white mt-[15px]' ref={registerForm} onSubmit={handleSubmit}>
            <input 
              className='input border-b outline-none py-1 bg-transparent p-2 w-full max-w-[250px]'
              required
              type="text" 
              name="name"
              placeholder="Enter name..."
            />
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
                type={showPassword ? 'text' : 'password'}
                name="password1" 
                placeholder="Enter password..."
                autoComplete="password1"
              />
              <span
                className='absolute text-black right-7 top-1/2 transform -translate-y-1/2 cursor-pointer'
                onClick={() => setShowPassword((prevShow) => !prevShow)}
              >
                   {showPassword ? <FaEyeSlash /> : <FaEye />} 
              </span>
            </div>
            <input 
              className='input border-b outline-none py-1 bg-transparent p-2 w-full max-w-[250px]'
              type='password'
              name="password2" 
              placeholder="Confirm password..."
              autoComplete="password2"
            />
            <button
                type='submit'
                value='register'
                className='rounded-full px-20 py-2 text-white bg-[#2432cf] shadow-md hover:shadow-slate-500'
            >
                Sign Up
            </button>
          </form>
          <div className='absolute flex justify-between gap-2 mt-[465px] text-white'>
            <p>Already have an account?</p>
            <Link to='/Users-login' className='underline hover:underline'>
                  Log in
            </Link>
        </div>
      </div>
   </main>
  )
}

export default Register
