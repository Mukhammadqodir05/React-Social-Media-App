import React,{ useState, useEffect } from "react";
import { useUserData } from '../../getUserData';
import { Link, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import{ auth, db } from '../../firebase'
import { doc, updateDoc,onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IoPersonCircleSharp } from "react-icons/io5";

const Profile = () => {
  const { userProfile, allUsersData } = useUserData();
  const { username } = useParams();
  const currentUser = allUsersData?.find(user => user.userName === username);
  const [user] = useAuthState(auth);
  const [followersCount, setFollowersCount] = useState(currentUser?.followers.length);
  const [followingCount, setFollowingCount] = useState(currentUser?.following.length);
  const [postCount, setPostCount] = useState(currentUser?.posts.length);
  const [posts, setPosts] = useState(currentUser?.posts.map(post => post))
  const [isFollowed, setIsFollowed] = useState(userProfile[0]?.following.includes(currentUser?.uid));
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  
  function formatCount(count) {
    if (count >= 1000000) {
      if (count % 1000000 === 0) {
        return (count / 1000000) + 'm';
      } else {
        return (count / 1000000).toFixed(1) + 'm';
      }
    } else if (count >= 1000) {
      if (count % 1000 === 0) {
        return (count / 1000) + 'k';
      } else {
        return (count / 1000).toFixed(1) + 'k';
      }
    } else {
      return count.toString();
    }
  }
  
  const formattedFollowers = formatCount(followersCount); 
  const formattedFollowing = formatCount(followingCount); 

  const timestamp = new Date(currentUser?.timestamp);
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  const joinedDate = `Joined ${monthNames[timestamp.getMonth()]} ${timestamp.getFullYear()}`;
  
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", currentUser?.uid), (doc) => {
      setFollowersCount(doc.data().followers.length);
      setFollowingCount(doc.data().following.length);
      setIsFollowed(doc.data().followers.includes(userProfile[0]?.uid));
      setPostCount(doc.data().posts.length)
      setPosts(doc.data().posts.map(post => post).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, [user.uid, currentUser?.uid]);


  const handleFollowAction = async (e) => {
    e.preventDefault();
  
    try {
      const userRef = doc(db, "users", user.uid);
      const userRef2 = doc(db, "users", currentUser.uid);
  
      if(userProfile[0]?.following.includes(currentUser?.uid)){
        const index = userProfile[0].following.indexOf(currentUser?.uid);
        userProfile[0].following.splice(index, 1); 

      } else {
        userProfile[0].following.push(currentUser?.uid); 
      }
  
      if(currentUser?.followers.includes(userProfile[0]?.uid)){
        const index = currentUser.followers.indexOf(userProfile[0]?.uid);
        currentUser.followers.splice(index, 1); 
      } else {
        currentUser.followers.push(userProfile[0]?.uid); 
      }
  
      const newData = {
        following: userProfile[0].following,
      };

      const newData2 = {
        followers: currentUser.followers,
      };
      
      await updateDoc(userRef, newData);
      await updateDoc(userRef2, newData2);
  
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center w-full h-screen">
        <p className="">Loading...</p>
    </div> 
  } else {
    return (
     <main className="flex flex-col w-full items-center justify-center h-full pt-0 pb-10">
       <div className="max-w-[900px] w-full h-full">
         <div className="flex gap-10 items-center w-full h-14 p-2">
          <Link className="hover:bg-[#363535] rounded-full p-2" title="Back to home" to='/'><IoMdArrowRoundBack  size={30}/></Link>
           <h1 className="text-xl cursor-pointer font-medium">{currentUser.fullName}</h1>
            </div>
            <div className="w-full h-full overflow-y-auto pb-9">
             <div className="relative ">
              <div className=" flex justify-center items-center w-full h-full max-h-[200px]">
              {currentUser.userBannerURL ? (
                  <img className="w-full max-w-[650px] object-cover aspect-square h-full max-h-[200px]" src={currentUser.userBannerURL} alt="" />
                ) : (<h1 className="w-full max-w-[650px] object-cover aspect-square h-full max-h-[200px] bg-[#524444]" src={currentUser.userBannerURL} alt="" />
  
                )}
              </div>
              <div className="p-2 absolute w-full flex justify-between gap-2">
              {currentUser.userPictureURL ? (
                <img
                  className="w-full mt-[-73px] bg-black object-cover aspect-square h-full max-h-36 max-w-36 rounded-full border-2 border-white"
                  src={currentUser.userPictureURL}
                />
              ) : (<div
                  className="w-full flex justify-center items-center mt-[-73px] bg-black aspect-square h-full max-h-32 max-w-32 rounded-full border-4"
              ><IoPersonCircleSharp className="flex w-full h-full"/></div>)}
                    {userProfile && (
                  <div className="relative mt-4">
                    {username !== userProfile[0]?.userName && (
                      <button onClick={handleFollowAction} className="bg-white text-black px-4 py-2 rounded-full">
                        {isFollowed? 'Followed' : 'Follow'} 
                      </button>
                    )}               
                    {username === userProfile[0].userName && (
                      <Link to={`/${currentUser.userName}/edit`} className="border border-blue-500 text-blue-500 px-4 py-2 rounded-full">
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
                  {currentUser.website && (
                    <p className="mt-4 w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                        🌐
                        <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          {currentUser.website}
                        </a>
                      </p>
                    )}
                  <div  className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                    <p>⏳{joinedDate}</p>
                    {currentUser.location?
                      <p>📍{currentUser.location}</p>
                    :''}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-screen">
                <p>Loading user profile...</p>
              </div>
            )}
              <div className="flex p-2 gap-5 mt-2 max-w-[400px] overflow-hidden ">
                <div className="flex gap-1">
                  <p className="font-bold">{formattedFollowing}</p>
                  <p className="text-gray-500">Following</p>
                </div>
                <div className="flex gap-1">
                  <p className="font-bold">{formattedFollowers}</p>
                  <p className="text-gray-500">Followers</p>
                </div>
                <div className="flex gap-1">
                  <p className="font-bold">{postCount}</p>
                  <p className="text-gray-500">Posts</p>
                </div>
              </div>

      {/* Posts here */}
              <div className="flex w-full border-t borderBg border-gray-300 "></div>
              <div className="grid grid-cols-3 gap-1 w-full p-1 pb-20">
               {posts.map((post, index) => (
                post.type === 'image' ? (
                  <img
                    key={index}
                    src={post.media}
                    className="object-cover aspect-square w-full h-full"
                    alt="Posted image"
                  />
                ) : post.type === 'video' ? (
                  <div key={index} className="relative">
                    <video
                      className="object-cover aspect-square w-full h-full"
                      onClick={() => setSelectedPost((post))}
                    >
                      <source src={post.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {selectedPost === post && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                        <video
                          className="object-cover h-full"
                          controls
                          autoPlay
                          onClick={(e) => e.stopPropagation()}
                        >
                          <source src={post.media} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {/* Add comments display here */}
                      </div>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          </div>
          </div>
       </main>
     );
  };
}

export default Profile;


