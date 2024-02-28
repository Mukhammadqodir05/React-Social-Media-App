import React, { useState } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BeatLoader } from 'react-spinners';

const SignIn = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="AuthenticationPageBg flex w-full items-center justify-center h-screen text-white p-3 overflow-hidden">
      <div className=" container bg-transparent w-full h-full max-w-80 max-h-[500px] flex items-center flex-col rounded-3xl p-4">
        <div className="space-y-2 text-sky-400">
          <BsPersonCircle className="text-9xl cursor-pointer" />
          <h1 className="text-center">Log in</h1>
        </div>
        <div className='absolute mt-[510px] sm:mt-[520px]'>
          {error && <p className="text-xl">{error}</p>}
        </div>
        <form onSubmit={handleLogin} className="mt-[50px] space-y-7 text-center w-full">
          <input
            className="input outline-none py-1 p-1 bg-transparent border-b w-full max-w-[240px]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete='off'
          />
          <div className='relative'>
            <input
              className='input outline-none py-1 p-1 bg-transparent border-b w-full max-w-[240px]'
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder='Password'
              autoComplete='off'
            />
            <span
              className='absolute right-7 top-1/2 transform -translate-y-1/2 cursor-pointer'
              onClick={() => setShowPassword(prevShow => !prevShow)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button onClick={handleLogin}  type="submit" className="w-full max-w-[240px] rounded-full py-2 text-white bg-[#9101ff]">
           { loading? <BeatLoader color='#8ff' loading={true} /> :  "Sign in"} 
          </button>
        </form>
        <div className='absolute flex gap-2 mt-[440px]'>
          <p className="text-sm">Don't have an account?</p>
          <button
            className="underline text-sm hover:underline"
            onClick={() => props.onFormSwitch('SignUp')}
          >
            Register
          </button>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
