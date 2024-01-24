import React from 'react';
import { UsersData } from '../../Data/HomeFeedData';
import { GoComment } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { FiBarChart2 } from "react-icons/fi";
import { TbHeartShare } from "react-icons/tb";

const HomeFeed = () => {
  return (
    <main className='flex flex-col items-center w-full h-full pt-10'>
      {UsersData.map((user) => (
        <div key={user.UserId} className='w-full p-4 border-t borderBg space-y-4'>
          <div className='flex items-center mb-2 '>
            <img className='h-12 w-12 rounded-full' src={user.ProfilePicture} alt='' />
            <div className='ml-4 flex gap-2 items-center'>
              <div className='flex items-center gap-1'>
                <h1 className='font-bold text-xl'>{user.UserFullName}</h1>
                <MdVerified title='Verified' size={26} className=' text-[#ffb300] cursor-pointer' />
              </div> 
              <h2 className='text-gray-500 text-sm'>{user.UserName}</h2>
            </div>
          </div>
          <div className='flex flex-col lg:pl-14 md:pl-10 sm:pl-8 gap-2'>
            <div className='w-full max-w-[550px] h-full flex flex-col justify-center items-center rounded-3xl border borderBg px-2 '>
              <img className='rounded-[10px] h-full max-h-[500px]' src={user.Posts} alt='' />
            </div>
              <div className='flex justify-around '>
                  <GoComment  size={20}/>
                  <FaRegHeart size={20}/>
                  <FiBarChart2 size={20}/>
                  <TbHeartShare size={20}/>
              </div>
            <div className='flex pb-10'>
              <span> Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias ullam, adipisci commodi, aliquam temporibus ex magni perferendis ad iste, nisi odit ut nesciunt molestiae nobis! Saepe iusto quo exercitationem officiis.</span>
           </div>
          </div>
        </div>
      ))}
    </main>
  );
};

export default HomeFeed;

