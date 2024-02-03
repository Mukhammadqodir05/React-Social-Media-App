import React, { useRef, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserData } from '../../getUserData';
import { useParams } from 'react-router-dom';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { TiCameraOutline } from 'react-icons/ti';

const Post = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [user] = useAuthState(auth);
  const fileRef = useRef(null);
  const { allUsersData } = useUserData();
  const { username } = useParams();
  const currentUser = allUsersData?.find((user) => user.userName === username);

  const handleUploadData = async (e) => {
    e.preventDefault();
    try {
      const storageRef = ref(storage, `posts/${user.uid}`);
      const uploadTasks = selectedFiles.map(async (file) => {
        await uploadString(storageRef, file, 'data_url');
        return getDownloadURL(storageRef);
      });
      const URLs = await Promise.all(uploadTasks);

      const userRef = doc(db, 'users', user.uid);
      const newPosts = (currentUser && currentUser.posts) 
        ? [...currentUser.posts, ...URLs]
        : [...URLs];
      const newData = {
        posts: newPosts,
      };
      await updateDoc(userRef, newData);
      window.location.reload();
      window.location.href = `/${currentUser.userName}`;
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };
  
  return (
    <main className='flex w-full text-black h-screen justify-center items-center'>
      <div className="w-full max-w-md border rounded bg-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
        <div className="w-full relative h-[400px] overflow-hidden outline-none mt-2 mb-4">
            <img 
              className="w-full h-full bg-gray-300" 
              src={selectedFiles} 
              alt="Selected"
            />

            <div 
              className="w-full h-full bg-gray-300 flex justify-center items-center"
            >
              <label 
                htmlFor="fileUpload" 
                className="cursor-pointer"
              >
                <TiCameraOutline size={42} />
                <input 
                  type="file" 
                  id="fileUpload" 
                  hidden 
                  ref={fileRef} 
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const reader = new FileReader();
                    reader.onload = function(event) {
                      setSelectedFiles([...selectedFiles, event.target.result]);
                    };
                    files.forEach(file => reader.readAsDataURL(file));
                  }}
                />
              </label>
            </div>
        </div>

        <form onSubmit={handleUploadData}>
          <textarea
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
