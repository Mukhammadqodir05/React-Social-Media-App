import React, { useState } from 'react';
import { GoComment } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";
import { TbHeartShare } from "react-icons/tb";
import { useUserData } from '../../getUserData'; 
import { Link } from 'react-router-dom';
import { IoPersonCircleSharp } from "react-icons/io5";

const ImageCard = ({ user, post }) => {
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleComment = (e) => {
    e.preventDefault();
  
    const updatedComments = [...post.comments, newComment];
    
    setNewComment('');
  };

  return (
    <div className='w-full p-4 border-t borderBg space-y-4 '>
      <div className='flex items-center mb-2 '>
        <Link to={`/${user?.userName}`}>
        { user?.userPictureURL?
          <img className='h-12 w-12 rounded-full border-2' src={user?.userPictureURL} alt='' />
        : <div className=' rounded-full bg-gray-300 flex items-center justify-center'><IoPersonCircleSharp size={50}/></div>
        } 
        </Link>
        <div className='ml-2 flex gap-2 items-center'>
          <div className='flex flex-col'>
            <Link to={`/${user?.userName}`}>
              <h1 className='font-bold text-xl'>{user?.fullName}</h1>
              <h2 className='text-gray-500 text-sm'>@{user?.userName}</h2>
            </Link>
          </div>
        </div>
      </div>
      <div className='flex justify-start max-w-[550px] overflow-hidden'>
        <p className='flex'>
          {post.caption}
        </p>
      </div>
      <div className='flex flex-col p-2 gap-5'>
        <div className='flex justify-center items-center'>
          <div className='flex w-full max-w-[500px] max-h-[550px] border borderBg p-2 rounded-[10px]'>
            <img src={post.image} className='w-full h-full aspect-square object-cover' alt='' />
          </div>
        </div>
        <div className='flex justify-around'>
          <div className='flex items-center justify-center space-x-1' onClick={toggleComments}>
            <GoComment size={20} className='text-gray-600 cursor-pointer' />
            <span className='text-xs text-gray-600'>{post.comments.length} Comments</span>
          </div>
    
          <div className='flex items-center justify-center space-x-1' onClick={handleLike}>
           <FaRegHeart size={20} className={liked ? 'text-red-500' : 'text-gray-600'} />
           <span className='text-xs text-gray-600'>{liked ? (post.likes)+1
              : (
              (post.likes)
              )}
            </span>
         </div>

          <div className='flex items-center justify-center space-x-1'>
            <FiBarChart2 size={20} className='text-blue-500' />
            <span className='text-xs text-gray-600'>{post.impressions}</span>
          </div>

          <div className='flex items-center justify-center space-x-1'>
            <TbHeartShare size={20} className='text-purple-500' />
            <span className='text-xs text-gray-600'>{post.shares}</span>
          </div>
        </div>
        {showComments && (
        <div>
          {post.comments.map((comment, index) => (
            <div key={index} className='flex justify-start max-w-[550px] overflow-hidden'>{comment}</div>
          ))}
          <form className='flex gap-3 mt-2'  onSubmit={handleComment}>
            <input className='bg-transparent outline-none border borderBg rounded-md'  type="text " value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      )}
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
        <div className='flex w-full borderBg h-[100px] py-10'></div>
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











