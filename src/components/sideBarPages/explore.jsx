import React, { useState, useEffect } from 'react';
import { useUserData } from '../../getUserData';
import { IoPersonCircleSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Trendmedia from '/src/assets/Trendmedia.png';
import { IoArrowDownCircle } from 'react-icons/io5';

const Explore = () => {
  const { allUsersData, userProfile } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [userCount, setUserCount] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredUsers = allUsersData?.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    if (searchTerm !== '') {
      setUserCount(filteredUsers.length);
    } else {
      setUserCount(null);
    }
  }, [searchTerm, filteredUsers]);
  

  return (
    <div className="flex flex-col justify-center items-center w-full h-full overflow-hidden">
      <div className="flex top-0 w-full border-b borderBg px-4 py-2">
        <input
          className="w-full bg-transparent border max-w-[300px] p-3 px-4 rounded-full border-purple-700 outline-none"
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="flex flex-col w-full h-full max-h-[500px] md:max-h-[500px] overflow-y-auto">
        {searchTerm && filteredUsers.length > 0 ? (
          filteredUsers
            .filter((user) => user.userName !== userProfile[0]?.userName)
            .map((user) => (
              <Link to={`/${user?.userName}`} key={user.id}>
                <div className="w-full rounded-md p-4 mb-4">
                  <div className="w-full ml-2 flex gap-2 items-center">
                    {user?.userPictureURL ? (
                      <img className="h-12 w-12 rounded-full border-2" src={user?.userPictureURL} alt="" />
                    ) : (
                      <div className="rounded-full bg-gray-300 flex items-center justify-center">
                        <IoPersonCircleSharp size={50} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <h1 className="font-bold text-xl">{user?.fullName}</h1>
                      <h2 className="text-gray-500 text-sm">@{user?.userName}</h2>
                    </div>
                  </div>
                </div>
              </Link>
            ))
        ) : (
          <div className="flex flex-col w-full h-screen justify-center items-center p-2">
            <h1 className="font-extrabold font-serif text-3xl gradient-text">Welcome to Trendmedia!</h1>
            <img className="w-96" src={Trendmedia} alt="Trendmedia" />
          </div>
        )}
      </div>
      { userCount >= 6 ?
        <div className="up-down-animation fixed bottom-20 sm:bottom-10">
        <IoArrowDownCircle size={55} color="#750be6"/>
      </div>
       :""}
    </div>
  );
};

export default Explore;
