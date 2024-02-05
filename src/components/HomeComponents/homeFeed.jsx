import React from 'react';
import { GoComment } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";
import { TbHeartShare } from "react-icons/tb";
import { useUserData } from '../../getUserData'; 
import { Link } from 'react-router-dom';

const ImageCard = ({ user, post }) => {

  return (
    <div className='w-full p-4 border-t borderBg space-y-4 '>
      <div className='flex items-center mb-2'>
       <Link to={`/${user?.userName}`}>
          <img className='h-12 w-12 rounded-full' src={user?.userPictureURL} alt='' />
         </Link>
           <div className='ml-4 flex gap-2 items-center'>
            <div className='flex flex-col'>
             <Link to={`/${user?.userName}`}>
              <h1 className='font-bold text-xl'>{user?.fullName}</h1>
              <h2 className='text-gray-500 text-sm'>@{user?.userName}</h2>
              </Link>
            </div>
          </div>
        </div>
       <span>{post.caption}</span>
      <div className='flex flex-col justify-center items-center p-2 gap-5'>
        <div className='flex justify-center w-full max-w-[500px] max-h-[550px] border borderBg p-2 rounded-[10px]'>
          <img src={post.image} className='w-full aspect-square  object-cover' alt='' />
        </div>
        <div className='grid grid-cols-4 gap-20'>
          <GoComment size={20} />
          <FaRegHeart size={20} />
          <FiBarChart2 size={20} />
          <TbHeartShare size={20} />
        </div>
        <div className='flex pb-0'>
        </div>
      </div>
    </div>
  );
};

const HomeFeed = () => {
  const { allUsersData } = useUserData();

  let allPosts = [];

  if (allUsersData) {
    allUsersData.forEach((user) => {
      if (user.posts && Array.isArray(user.posts)) {
        user.posts.forEach((post) => {
          const postWithUser = {
            user: user,  
            post: post  
          };
          allPosts.push(postWithUser);
        });
      }
    });
    
    allPosts.sort((a, b) => new Date(b.post.timestamp) - new Date(a.post.timestamp));

    return (
      <main className='flex flex-col items-center w-full h-full'>
        {allPosts.map((postWithUser, index) => {
          return (
            <ImageCard key={index} user={postWithUser.user} post={postWithUser.post} />
          );
        })}
      </main>
    );
  } else {
    return null;
  }
};

export default HomeFeed;











