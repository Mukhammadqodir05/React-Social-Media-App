import React, { useRef, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserData } from '../../getUserData';
import { TiCameraOutline } from 'react-icons/ti';
import { ref, uploadString, getDownloadURL} from 'firebase/storage'
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';

const Post = () => {
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [success, setSuccess] = useState(false); 
  const [user] = useAuthState(auth);
  const fileRef = useRef(null);
  const { userProfile } = useUserData();
  
  const validateImage = (image) => {
      if(!image.name.match(/\.(jpg|jpeg|png|gif)$/)){
        setButtonDisabled((prev) => !prev)
          setError(true)
      }
      else{
        setButtonDisabled(false)
        setError(false)
      }
  }
  
  const handleUploadData = async (e) => {
    e.preventDefault();
    setLoading(true)
    
    try {
      const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${selectedFiles.name}`); 
      await uploadString(storageRef, selectedFiles, "data_url");
      const url = await getDownloadURL(storageRef); 
  
      const userRef = doc(db, "users", user.uid);
      const newPost = {
        image: url,
        caption: e.target.caption.value,
        likes: 0,
        comments: [],
        timestamp: new Date().toISOString()  
      };
  
      await updateDoc(userRef, {
        posts: [...userProfile[0].posts, newPost]
      });
  
      setSuccess(true);
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      setLoading(false)
    }
  };

  setTimeout(() =>{
    setError(false)
  }, 5000) 
  
  
  return (
    <main className='flex w-full h-screen justify-center items-center p-1'>
      <div className="w-full AuthenticationPageBg max-w-md border rounded p-4">
       <div className='flex justify-between w-full'>
         <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
          {userProfile && <Link to={`/${userProfile[0]?.userName}`}><IoMdClose title='close' size={37} className='hover:bg-[#000000] hover:bg-opacity-30 rounded-full cursor-pointer'/></Link>}
            </div>
             <div className="flex rounded-md bg-black justify-center items-center w-full h-[290px] relative overflow-hidden outline-none mt-2 mb-4">
              <img className=' border-2 border-white' src={selectedFiles} alt="" />
                <div className='absolute inset-0 flex items-center justify-center'>
                 <div className='flex bg-black p-2 rounded-full bg-opacity-70'>
                  <TiCameraOutline onClick={() => fileRef.current.click()} className='cursor-pointer text-white text-7xl'/>
                  <input type="file" 
                    hidden ref={fileRef} 
                    onChange={(e) => {
                    validateImage(e.target.files[0])
                    const file = e.target.files[0]; 
                    const reader = new FileReader();
                    reader.onload = function(event) {
                    setSelectedFiles(event.target.result);
                    }
                    reader.readAsDataURL(file);
                    }}
                  />
               </div>
             </div>
           </div>
          <form className='text-black' onSubmit={handleUploadData}>
          <textarea
            name="caption" 
            className="w-full border p-2 mb-4 rounded-md outline-none"
            placeholder="What's happening?"
            rows="4"
          />
          <button
            type="submit"
            className="PostButton text-2xl font-medium font-serif w-full text-white rounded p-2 hover:bg-blue-600"
            disabled={isButtonDisabled}
         >
          {loading? 'Uploading...' : 'Post' }
          </button>
        </form>
        </div>
        {error && (
        <div className='w-full max-w-md fixed h-[50px] top-4 flex justify-center items-center bg-white rounded-md text-black'>
            <p className=' text-xl'>Ops, only jpg, jpeg, png, or gif are allowed</p>
        </div>
      )}
        {success && (
        <div className='w-full max-w-md fixed h-[50px] top-4 flex justify-center items-center bg-white rounded-md text-black'>
            <p className=' text-xl'>Your image has been successfully uploaded.</p>
        </div>
      )}
    </main>
  );
};

export default Post;



