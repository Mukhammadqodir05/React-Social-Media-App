import React from 'react';
import { useUserData } from '../../getUserData';
import { Link } from 'react-router-dom';
import { IoPersonCircleSharp } from "react-icons/io5";

const RightSideBar = () => {
  const { allUsersData, userProfile } = useUserData();

  return (
    <main className='flex flex-col items-center w-full h-full p-1'>
      <div className='w-full bg-black bg-opacity-30 p-2 mt-4 rounded-md'>
        <textarea
          type='text'
          placeholder='Search new for trends...'
          className='w-full p-2 rounded-md border borderBg bg-black bg-opacity-30 focus:outline-none'
        />
      </div>
      {allUsersData && (
        <div className='w-full mt-4'>
          <div className='bg-black bg-opacity-30 p-4 rounded-md shadow'>
            <h2 className='text-lg font-bold mb-4'>Active creators</h2>
            {allUsersData.filter(user => user.userName !== userProfile[0]?.userName).map((user) => (
              <div key={user.id} className='flex w-full items-center justify-between p-2 border-b borderBg'>
                <div className='flex items-center'>
                <Link to={`/${user?.userName}`}>
                {user.userPictureURL ? 
                 <img
                   src={user.userPictureURL}
                   alt='User profile'
                   className='w-8 h-8 rounded-full mr-2'
                    /> 
                    : <div className=' rounded-full bg-gray-300 flex items-center justify-center mr-2'><IoPersonCircleSharp size={30}/></div>
                    }
                  </Link>
                  <div>
                   <Link to={`/${user?.userName}`}>
                    <p className='font-bold w-full max-w-[120px] xl:max-w-[155px] 2xl:max-w-[250px] overflow-hidden overflow-ellipsis text-nowrap'>{user.fullName}</p>
                    <p className='text-gray-500 text-base '>@{user.userName}</p>
                   </Link>
                  </div>
                </div>
                <Link to={`/${user?.userName}`}>
                <button className='bg-blue-500 text-white px-4 py-1 rounded-md'>
                  View
                </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default RightSideBar;

