import React, { useEffect } from 'react';
import { auth, db } from '../firebase';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const GoogleSignUp = () => {

    const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };


  useEffect(() => {
         const handleRedirectResult = async () => {
           try {
             const result = await getRedirectResult(auth);
             if (result && result.user) {
               const { uid, displayName, email, photoURL } = result.user;
               const userDoc = {
                 uid: uid,
                 fullName: displayName,
                 userName: email.split('@')[0],
                 email: email,
                 bio: '',
                 userPictureURL: photoURL,
                 followers: [],
                 following: [],
                 posts: [],
                 timestamp: Date.now()
               };
               await setDoc(doc(db, 'users', uid), userDoc);
               console.log(userDoc)

             }
           } catch (error) {
             console.error(error);
           }
         };
       
         handleRedirectResult();
       }, []);
       
       

  return (
    <main>
      <GoogleButton onClick={googleSignIn} />
    </main>
  );
};

export default GoogleSignUp;
