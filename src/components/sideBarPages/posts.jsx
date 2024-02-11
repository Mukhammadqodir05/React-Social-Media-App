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
  const [type, setType] = useState('');
  const [video, setVideo] = useState(null);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [success, setSuccess] = useState(false); 
  const [user] = useAuthState(auth);
  const fileRef = useRef(null);
  const { userProfile } = useUserData();
  const videoRef = useRef();
  
  const handleUploadData = async (e) => {
    e.preventDefault();
    setLoading(true)
    
    try {
      const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${selectedFiles.name}`); 
      await uploadString(storageRef, selectedFiles, "data_url");
      const url = await getDownloadURL(storageRef); 
      const id = user.uid + selectedFiles.name
  
      const userRef = doc(db, "users", user.uid);
      const newPost = {
        media: url,
        id: id,
        type: type,
        caption: e.target.caption.value,
        likes: [],
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
          
          {/* Video and image here */}
           <div className="flex z-10 rounded-md bg-black justify-center items-center w-full h-[390px] relative overflow-hidden outline-none mt-2 mb-4">
            <div className="relative w-full h-full">
              {type === 'image' ? (
                <img className='object-cover aspect-square w-full max-h-[414px] h-full' src={selectedFiles} alt="" />
              ) : type === 'video' ? (
                <video ref={videoRef} className='object-cover aspect-square w-full max-h-[414px] h-full' controls autoPlay loop>
                  <source src={video} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              ) : (
                ''
              )}
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-2 rounded-full bg-opacity-70'>
                <TiCameraOutline onClick={() => fileRef.current.click()} className='cursor-pointer text-white text-5xl' />
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
                      const reader = new FileReader();
                      reader.onload = function(event) {
                        setSelectedFiles(event.target.result);
                      };
                      reader.readAsDataURL(file);
                      setType('image');
                    } else if (file.name.match(/\.(mp4|webm|avi|mov)$/)) {
                      setVideo(URL.createObjectURL(file))
                      const reader = new FileReader();
                      reader.onload = function(event) {
                        setSelectedFiles(event.target.result);
                      };
                      reader.readAsDataURL(file);
                      setType('video');
                    }
                  }}
                />
              </div>
            </div>
          </div>


         {/* Form here */}
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

