import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { query, where, getDocs, collection } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from "react-router-dom";

const Profile = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, loading] = useAuthState(auth); 
  const [usernames, setUsername] = useState(""); 
  const { username } = useParams();
  
  const fetchUserProfile = async () => {
    if (!loading && user) { 
      setIsLoading(true);
      const uid = user.uid;
      const q = query(collection(db, "users"), where("uid", "==", uid));
      try {
        console.log("Fetching user profile...");
        const querySnapshot = await getDocs(q);
        let userProfileData = [];
        querySnapshot.forEach((doc) => {
          userProfileData.push({ id: doc.id, ...doc.data() });
        });
        setData(userProfileData);
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, [user, loading]); 
  
  useEffect(() => {
    if (data.length > 0) {
      setUsername(data[0].userName);
    }
  }, [data]);




  return (
    <main className="flex flex-col w-full items-center justify-center h-full pb-10 pt-10">
      <div className="border-b borderBg borderBg w-full"></div>
      <div className="max-w-[900px] w-full h-full p-3">
        <div className="w-full flex flex-col  items-center space-y-5">
          {data.map((profile) => (
            <div key={profile.id} className="flex flex-col w-full gap-5">
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
          ))}
        </div>
      </div>
    </main>
  );
};

export default Profile;




