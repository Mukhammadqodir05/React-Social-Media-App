import React from "react";
import { useUserData } from '../../getUserData';
import { Link, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Profile = () => {
  const { userProfile, allUsersData } = useUserData();
  const { username } = useParams();
  const currentUser = allUsersData?.find(user => user.userName === username);

  const timestamp = new Date(currentUser?.timestamp);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const joinedDate = `Joined ${monthNames[timestamp.getMonth()]} ${timestamp.getFullYear()}`;

  return (
    <main className="flex flex-col w-full items-center justify-center h-full pt-0 pb-10">
      <div className="max-w-[900px] w-full h-full ">
       <div className="flex items-center p-3 w-full h-14 bg-black bg-opacity-50">
       <Link to='/'><IoMdArrowRoundBack  size={30}/></Link>
       </div>
        <div className="relative">
        <div className="w-full h-full max-h-[200px]">
          {currentUser.userBannerURL ? (
              <img className="w-full max-w-[650px] object-cover aspect-square h-full max-h-[200px]" src={currentUser.userBannerURL} alt="" />
            ) : (<h1 className="w-full max-w-[650px] object-cover aspect-square h-full max-h-[200px] bg-[#524444]" src={currentUser.userBannerURL} alt="" />

            )}

          </div>
          <div className="p-2 absolute w-full flex justify-between gap-2">
          {currentUser.userBannerURL ? (
            <img
              className="w-full mt-[-73px] bg-black object-cover aspect-square h-full max-h-32 max-w-32 rounded-full border-2 border-white"
              src={currentUser.userPictureURL}
            />
          ) : (<h1
               className="w-full mt-[-73px] bg-black aspect-square h-full max-h-32 max-w-32 rounded-full border-4 border-black"
               src={currentUser.userPictureURL}
          />)}
          
            {userProfile && (
              <div className="relative mt-4">
                {username !== userProfile[0]?.userName && (
                  <button className="bg-white text-black px-4 py-2  rounded-full">Follow</button>
                )}
                {username === userProfile[0].userName && (
                  <Link
                    to={`/${currentUser.userName}/edit`}
                    className="border border-blue-500 text-blue-500 px-4 py-2 rounded-full"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        {currentUser ? (
          <div className="p-2 mt-[80px] w-full">
            <h1 className="text-xl font-medium">{currentUser.fullName}</h1>
            <p className="text-xl text-gray-500">@{currentUser.userName}</p>
            { currentUser.bio?
              <p className="mt-4">{currentUser.bio}</p>
            :''} 
            <div className="flex flex-col text-gray-500 mt-2">
              {currentUser.website?
                <p className="w-full">🌐{currentUser.website}</p>
              :''}
              <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                <p>⏳{joinedDate}</p>
                {currentUser.location?
                  <p>📍{currentUser.location}</p>
                :''}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 mt-4 max-w-[300px]">
              <div className="flex gap-1">
                <p className="font-bold">{currentUser.following}</p>
                <p className="text-gray-500">Following</p>
              </div>
              <div className="flex gap-1">
                <p className="font-bold">{currentUser.followers}</p>
                <p className="text-gray-500">Followers</p>
              </div>
              <div className="flex gap-1">
                <p className="font-bold">{currentUser.posts}</p>
                <p className="text-gray-500">Posts</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-screen">
            <p>Loading user profile...</p>
          </div>
        )}
      <div className="flex w-full border-t borderBg border-gray-300 "></div>
        <div className="grid grid-cols-3 gap-1 w-full p-1 pb-20 ">
          <img src="src/assets/Verified copy.jpg" className='object-cover aspect-square w-full h-full '/>
          <img src="src/assets/Verified copy.jpg" className='object-cover aspect-square w-full h-full '/>
          <img src="src/assets/Verified copy.jpg" className='object-cover aspect-square w-full h-full '/>
          <img src="src/assets/mishary2.png" className='object-cover aspect-square w-full h-full'/>
        </div>
      </div>
    </main>
  );
};

export default Profile;
