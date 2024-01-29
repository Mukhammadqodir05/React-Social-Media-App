import React from "react";
import { useUserData } from '../../getUserData'; 

const Profile = () => {
  const { userProfile } = useUserData(); 

  return (
    <main className="flex flex-col w-full items-center justify-center h-full pb-10 pt-10">
      <div className="border-b borderBg borderBg w-full"></div>
      <div className="max-w-[900px] w-full h-full p-3">
        <div className="w-full flex flex-col  items-center space-y-5">
          {userProfile?  
           userProfile.map((profile) => (
            <div key={profile.uid} className="flex flex-col w-full gap-5">
              <div className="flex items-center gap-6">
                <img className="h-20 w-20 rounded-full bg-black" src={profile.userPictureURL} />
                <div>
                  <h2 className="text-xl font-bold">{profile.fullName}</h2>
                  <p className="text-gray-500">@{profile.userName}</p>
                </div>
              </div>
              <div className="flex justify-between space-x-4 mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Follow</button>
                <button className="border border-gray-400 px-4 py-2 rounded-md">Message</button>
              </div>
               <p className="mt-4">{profile.bio}</p>
            </div>
          )) :  (
              <p>Loading user profile...</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;




