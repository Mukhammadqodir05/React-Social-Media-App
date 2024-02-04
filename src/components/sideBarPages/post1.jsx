import React, { useRef, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserData } from '../../getUserData';
import { TiCameraOutline } from 'react-icons/ti';
import { ref, uploadString, getDownloadURL} from 'firebase/storage'

const Post = () => {
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [user] = useAuthState(auth);
  const fileRef = useRef(null);
  const { userProfile } = useUserData();
  
   
  
  const handleUploadData = async (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `posts/${user.uid}`);
    let url = '';
    
    try {
      if (selectedFiles) {
        await uploadString(storageRef, selectedFiles, "data_url")
        url = await getDownloadURL(ref(storage, `posts/${user.uid}`)) 
      }
      
      const userRef = doc(db, "users", user.uid);
      
      const newPost = {
        image: selectedFiles,
        caption: e.target.caption.value,
        likes: 0,
        comments: []
      };
    
      await updateDoc(userRef, {
        posts: [...userProfile[0].posts, newPost]
      });
   
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };
  
  
 
  return (
    <main className='flex w-full text-black h-screen justify-center items-center'>
      <div className="w-full max-w-md border rounded bg-white p-4 shadow-lg">
         <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
           <div className="flex justify-center items-center w-full h-[250px] relative overflow-hidden outline-none mt-2 mb-4">
               <img className=' border-2 border-white' src={ selectedFiles} alt="" />
                <div className='absolute inset-0 flex items-center justify-center'>
                 <div className='flex bg-black p-2 rounded-full bg-opacity-70'>
                  <TiCameraOutline onClick={() => fileRef.current.click()} className='cursor-pointer text-white text-xl'/>
                  <input type="file" 
                    hidden ref={fileRef} 
                    onChange={(e) => {
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
          <form onSubmit={handleUploadData}>
          <textarea
            name="caption" 
            className="w-full border p-2 mb-4"
            placeholder="What's happening?"
            rows="4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-2 px-4 hover:bg-blue-600"
          >
            Post
          </button>
        </form>
      </div>
    </main>
  );
};

export default Post;



