import React from "react";
import { useUserData } from '../../getUserData';
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const { userProfile, allUsersData } = useUserData();
  const { username } = useParams();
  const currentUser = allUsersData?.find(user => user.userName === username);

  return (
    <main className="flex flex-col w-full items-center justify-center h-full pb-10 pt-10">
      <div className="border-b borderBg w-full"></div>
      <div className="max-w-[900px] w-full h-full p-3">
        <div className="w-full flex flex-col items-center space-y-5">
          {currentUser ?
            <div key={currentUser.uid} className="flex flex-col w-full gap-5">
              <div className="flex items-center gap-6">
                <img className="h-20 w-20 rounded-full bg-black" src={currentUser.userPictureURL} />
                <div>
                  <h2 className="text-xl font-bold">{currentUser.fullName}</h2>
                  <p className="text-gray-500">@{currentUser.userName}</p>
                </div>
              </div>
              {/* Buttons */}
              {userProfile ? 
              <div className="flex justify-between space-x-4 mt-4">
                {username !== userProfile[0]?.userName && (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Follow</button>
                )}
                {username === userProfile[0].userName && (
                  <Link to={`/${currentUser.userName}/edit`} className="border border-gray-400 px-4 py-2 rounded-md">Edit profile</Link>
                )}
              </div>
               :''} 
              <p className="mt-4">{currentUser.bio}</p>
            </div>
            :
            <div className="flex justify-center items-center w-full h-screen">
              <p>Loading user profile...</p>
            </div>
          }
        </div>
      </div>
    </main>
  );
};

export default Profile;
