import React, { useState } from 'react';
import { useUserData } from '../../getUserData';
import { IoPersonCircleSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Interactify from'/src/assets/Interactify.png'

const Explore = () => {
  const { allUsersData, userProfile } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = allUsersData?.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-center w-full h-full ">
      <div className='flex top-0 w-full border-b borderBg px-4 py-2'>
        <input
          className="w-full  bg-transparent border max-w-[300px] p-3 px-4 rounded-full  border-purple-700  outline-none "
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div>
      <div className='flex w-full h-full max-h-[500px] md:max-h-[500px] flex-col  overflow-y-auto'>
        {searchTerm && filteredUsers.length > 0 ? (
          filteredUsers.filter(user => user.userName !== userProfile[0]?.userName).map((user) => (
           <Link to={`/${user?.userName}`}>
            <div key={user.id} className="w-full rounded-md p-4 mb-4">
              <div className='w-full ml-2 flex gap-2 items-center'>
              { user?.userPictureURL?
                <img className='h-12 w-12 rounded-full border-2' src={user?.userPictureURL} alt='' />
                : <div className=' rounded-full bg-gray-300 flex items-center justify-center'><IoPersonCircleSharp size={50}/></div>
              } 
               <div className='flex flex-col'>
              <h1 className='font-bold text-xl'>{user?.fullName}</h1>
              <h2 className='text-gray-500 text-sm'>@{user?.userName}</h2>
           </div>
           </div>
            </div>
           </Link>
          ))
        ): (
          <div className='flex flex-col w-full h-screen justify-center items-center p-2'>
            <h1 className='font-extrabold font-serif text-3xl gradient-text'>Welcome to Interactify!</h1>
            <img className='w-96 ' src={Interactify}/>
        </div>
        )}  
        </div>
       </div>
    </div>
  );
};

export default Explore;
