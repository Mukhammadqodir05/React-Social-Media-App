import React, { useState } from 'react';
import { auth } from '../firebase';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithRedirect, createUserWithEmailAndPassword } from 'firebase/auth';
import { BsPersonCircle } from 'react-icons/bs';

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

const SignUp = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AuthenticationPageBg flex w-full items-center justify-center h-screen p-3">
      <div className="md:w-80 container bg-transparent w-full h-full max-w-72 max-h-[500px] flex items-center flex-col rounded-3xl p-4">
        <div className="space-y-2 text-sky-400">
          <BsPersonCircle className="text-9xl cursor-pointer" />
          <h1 className="text-center">Register</h1>
        </div>
        <GoogleButton className="absolute mt-[370px]" onClick={googleSignIn} />
        <div className='absolute mt-[510px] sm:mt-[520px]'>
          {error && <p className="text-xl">{error}</p>}
          {loading && <p className="text-xl">Loading...</p>}
        </div>
        <form onSubmit={handleSignUp} className="mt-[10px] text-white space-y-7 text-center">
          <input
            className="input outline-none py-1 p-1 bg-transparent border-b w-full max-w-[240px]"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          />
          <input
            className="input outline-none py-1 p-1 bg-transparent border-b w-full max-w-[240px]"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="**********"
          />
          <button type="submit" className="w-full max-w-[240px] rounded-full py-2 text-white bg-[#2432cf]">
            Sign up
          </button>
        </form>
        <div className='absolute flex gap-2 mt-[445px]'>
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

