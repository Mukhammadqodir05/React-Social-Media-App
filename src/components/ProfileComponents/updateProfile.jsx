import React, { useRef, useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserData } from '../../getUserData';
import { TbCameraPlus } from "react-icons/tb";
import { Await, Link,useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { ref, uploadString, getDownloadURL } from 'firebase/storage'

const UpdateProfile = () => {
  const [selectedImage, setSelectedImage] = useState('')
  const {allUsersData} = useUserData(); 
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');
  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
   

  const [user] = useAuthState(auth);
  const fileRef = useRef(null);
  const { username } = useParams();
  const currentUser = allUsersData?.find(user => user.userName === username);
 
  const MAX_BIO_LENGTH = 150;
  const handleBioChange = (e) => {
    const inputBio = e.target.value;
    const limitedBio = inputBio.substring(0, MAX_BIO_LENGTH); 
    setBio(limitedBio);
  };
  const remainingCharacters = MAX_BIO_LENGTH - bio.length;
  
  const handleUpdateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const storageRef = ref(storage, `userPictureURL/${user.uid}`)
    let URL = ''
    try {
      if (selectedImage) {
         await uploadString(storageRef, selectedImage, "data_url")
         URL = await getDownloadURL(ref(storage, `userPictureURL/${user.uid}`))     
      }
      const userRef = doc(db, "users", user.uid);
      const newData = {
        fullName: fullName || currentUser.fullName,
        userName: userName || currentUser.userName,
        bio: bio || currentUser.bio,
        location: location || currentUser.location,
        website: website || currentUser.website,
        userPictureURL:  URL || currentUser.userPictureURL,
      };
  
      await updateDoc(userRef, newData);
      window.location.reload();
      window.location.href = `/${newData.userName}`;
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
      setSuccess(false)
    } finally {
    }
  };
  
  
  
  return (
    <main className='flex flex-col w-full h-screen items-center justify-center p-3 bg-black'>
    {currentUser? 
     <div className="flex flex-col  w-full sm:max-w-[600px] h-full">
      <div className='flex fixed h-12 '>
        <Link to={`/${currentUser.userName}`} ><IoMdArrowRoundBack className='text-[35px] cursor-pointer'/></Link>
           </div>
            <div className='flex flex-col w-full h-full justify-center items-center overflow-scroll pt-40 mt-[50px]'>
             <div className="w-full flex flex-col gap-10 ">
              <div className='flex w-36 h-36 rounded-full bg-gray-500 relative'>
               <img className='rounded-full' src={selectedImage || currentUser.userPictureURL} alt="" />
                <div className='absolute inset-0 flex items-center justify-center'>
                 <div className='flex bg-black p-2 rounded-full bg-opacity-70'>
                  <TbCameraPlus onClick={() => fileRef.current.click()} className='cursor-pointer text-white text-xl'/>
                  <input type="file" 
                          hidden ref={fileRef} 
                           onChange={(e) => {
                           const file = e.target.files[0]; 
                           const reader = new FileReader();
                           reader.onload = function(event) {
                           setSelectedImage(event.target.result);
                           }
                           reader.readAsDataURL(file);
                      }}
                  />
                  </div>
                  </div>
                  </div>
                 <form className='flex w-full flex-col mb-10' onSubmit={handleUpdateData}>
                  <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="full-name">
                  Full Name
                  </label>
                  <input
                    className="shadow bg-transparent border borderBg rounded w-full py-2 px-3 leading-tight outline-none "
                    id="full-name"
                    type="text"
                    placeholder={currentUser.fullName}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
            </div>
            <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user-name">
                  User Name
                  </label>
                  <input
                  className="shadow bg-transparent border borderBg rounded w-full py-2 px-3 leading-tight outline-none"
                  id="user-name"
                  type="text"
                  placeholder={currentUser.userName}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  />
             </div>
             <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                Bio <span className="text-gray-500 text-sm">{remainingCharacters}/{MAX_BIO_LENGTH}</span>
              </label>
              <textarea
                className="shadow bg-transparent border borderBg rounded w-full py-2 h-[100px] px-3 leading-tight outline-none"
                id="bio"
                placeholder={currentUser.bio}
                value={bio}
                onChange={handleBioChange}
              />
            </div>
             <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Location
                  </label>
                  <input
                  className="shadow bg-transparent border borderBg rounded w-full py-2 px-3 leading-tight outline-none"
                  id="location"
                  type="text"
                  placeholder={currentUser.location}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  />
             </div>
             <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Website
                  </label>
                  <input
                  className="shadow bg-transparent border borderBg rounded w-full py-2 px-3 leading-tight outline-none"
                  id="website"
                  type="text"
                  placeholder={currentUser.website}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  />
             </div>
             <div className="flex items-center justify-between">
             <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:s
              hadow-outline"
              type="submit"
              >
              {loading ? 'Updating...' : 'Update Profile'}
              </button>
             </div>
           </form>
         </div>
        </div>
      </div>
      :  (
         <p>Loading...</p>
     )}
  </main>
  );
};

export default UpdateProfile;



 