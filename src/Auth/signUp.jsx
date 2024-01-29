import React, { useState } from 'react';
import { auth, db } from '../firebase';
// import GoogleSignUp from './googleSignUp';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { BsPersonCircle } from 'react-icons/bs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { setDoc,doc} from 'firebase/firestore';



const SignUp = (props) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newUser = await createUserWithEmailAndPassword(auth, email, password);
      if(newUser){
        const userDoc = {
          uid: newUser.user.uid,
          fullName: fullName,
          userName: email.split('@')[0],
          email: email,
          bio: "",
          userPictureURL: '',
          followers: [],
          following: [],
          posts: [],
          timestamp:Date.now()
        }
        await setDoc(doc(db, 'users', newUser.user.uid), userDoc);
        console.log(userDoc);
      }
     
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AuthenticationPageBg flex w-full items-center justify-center h-screen p-3">
      <div className="md:w-80 container bg-transparent w-full h-full max-w-80 max-h-[500px] flex items-center flex-col rounded-3xl p-4">
        <div className="space-y-2 text-sky-400">
          <BsPersonCircle className="text-9xl cursor-pointer" />
          <h1 className="text-center">Register</h1>
        </div>
        {/* <div className="absolute mt-[390px]">
          <GoogleSignUp/>
        </div> */}
        <div className='absolute mt-[540px]'>
          {error && <p className="text-xl">{error}</p>}
          {loading && <p className="text-xl">Loading...</p>}
        </div>
        <form onSubmit={handleSignUp} className="mt-[15px] text-white space-y-7 text-center">
          <input
            className="input outline-none py-1 p-1 bg-transparent border-b w-full max-w-[240px]"
            required
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            className="input outline-none py-1 p-1 bg-transparent border-b w-full max-w-[240px]"
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          />
         <div className='relative'>
            <input
              className='input outline-none py-1 p-1 bg-transparent border-b w-full max-w-[240px]'
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder='Password'
            />
            <span
              className='absolute right-7 top-1/2 transform -translate-y-1/2 cursor-pointer text-black'
              onClick={() => setShowPassword(prevShow => !prevShow)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="w-full max-w-[240px] rounded-full py-2 text-white bg-[#2432cf]">
            Sign up
          </button>
        </form>
        <div className='absolute flex gap-2 mt-[440px]'>
          <p className="text-sm">Already have an account?</p>
          <button
            className="underline text-sm hover:underline"
            onClick={() => props.onFormSwitch('SignIn')}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;


