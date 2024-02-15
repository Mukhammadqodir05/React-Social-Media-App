import React,{ useState, useEffect } from "react";
import { useUserData } from '../../getUserData';
import { Link, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import{ auth, db } from '../../firebase'
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IoPersonCircleSharp } from "react-icons/io5";
import { FadeLoader } from 'react-spinners';
import { MdClose } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { LiaUserEditSolid } from "react-icons/lia";
import { BiSolidEditAlt } from "react-icons/bi";
import { TbPlayerPlayFilled } from "react-icons/tb";

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
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isPostSelected, setIsPostSelected] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  
  // Formating
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
  

  // Real-Time Database 
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


//  Handle Follow 
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


// Handle Video Ckick
  const handleVideoClick = (post, index) => {
    setSelectedPost(post);
    setSelectedPostType('video');
    setIsPostSelected(true);
    setClickedIndex(index);
  };

  // Handle Image Ckick
  const handleImageClick = (post, index) => {
    setSelectedPost(post);
    setSelectedPostType('image');
    setIsPostSelected(true);
    setClickedIndex(index);
  };


  // Handle Delete
  const handleDeletePost = async () => {
      try {
        setShowConfirmation(false)
        const userRef = doc(db, "users", user.uid);

        if (clickedIndex !== -1) {
            userProfile[0].posts.splice(clickedIndex, 1); 
            const updatedData = {
                posts: userProfile[0].posts,
            };
            await updateDoc(userRef, updatedData);
            console.log('Post deleted successfully');
        } else {
            console.log('Post not found in the user\'s posts array');
        }
      } catch (error) {
          console.error('Error deleting post:', error);
      }
  };

  

if (isLoading) {
    return (
    <div className="flex justify-center items-center w-full h-screen">
      <FadeLoader color='#F9008E' size={50} loading={true} /> 
    </div> 
)
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
                      <Link to={`/${currentUser.userName}/edit`} className=" text-[#e600ff]">
                        <LiaUserEditSolid title="edit" size={35} />
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
                            onClick={() => handleImageClick(post, posts.length - 1 - index)}
                            key={index}
                            src={post.media}
                            className="object-cover aspect-square w-full h-full"
                            alt="Posted image"
                        />
                    ) : post.type === 'video' ? (
                        <div key={index} className="relative">
                            <video
                                className="object-cover aspect-square w-full h-full"
                                onClick={() => handleVideoClick(post, posts.length - 1 - index)} 
                            >
                                <source src={post.media} type="video/mp4" />
                            </video>
                        </div>
                    ) : null
                ))}
            </div>
            </div>
            </div>
        
          { isPostSelected && (
            <div className="fixed flex-col top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-90 z-50">
              <div className="flex lg:mt-0 bg-black w-full max-w-[700px] lg:max-w-[1200px] flex-col-reverse lg:flex-row">
                <div className="w-full border-b lg:border borderBg flex justify-center items-center relative">
                  { showPauseIcon && 
                      <div className="absolute flex items-center bg-black rounded-full bg-opacity-50 p-4">
                        <TbPlayerPlayFilled size={60}/>
                      </div>
                    }
                    {selectedPostType === 'video' ? (
                      <video className="w-full cursor-pointer max-w-[500px] lg:max-w-[560px] xl:max-w-[600px] 2xl:max-w-[630px] aspect-square" 
                        autoPlay
                        loop
                        onClick={(e) => {
                            if (e.target.paused) {
                                e.target.play();
                                setShowPauseIcon(false);
                            } else {
                                e.target.pause();
                                setShowPauseIcon(true);
                            }
                        }}
                      >
                        <source className="" src={selectedPost.media} type="video/mp4" />
                      </video>
                      

                    ) : selectedPostType === 'image' ? (
                      <img className="object-cover w-full h-full max-h-[500px] lg:max-h-[560px] xl:max-h-[600px] 2xl:max-h-[630px] aspect-square" src={selectedPost.media} alt="Selected Post" />
                    ) : null }
                </div>

                {/* Comments, Delete Button, Owner Profile Section */}
                 <div className="flex flex-col w-full max-w-[700px] h-full max-h-[700px] lg:max-w-[500px] justify-between items-center bg-black">
                  <div className="flex border-t lg:border lg:border-l-0 borderBg w-full max-w-[700px] max-h-24 lg:max-w-[500px] justify-between items-center p-2">
                    <Link to={`/${userProfile[0]?.userName}`} className="flex items-center">
                      {currentUser?.userPictureURL ? (
                        <img className='h-10 w-12 rounded-full border-2' src={currentUser?.userPictureURL} alt='' />
                      ) : (
                        <div className='rounded-full bg-gray-300 flex items-center justify-center'><IoPersonCircleSharp size={40} /></div>
                      )}
                      <span className="ml-2 max-w-[300px] w-full overflow-hidden overflow-ellipsis text-nowrap">{currentUser.fullName}</span>
                    </Link>

                    { username === userProfile[0].userName && (
                    <div>
                      <button className=" hover:text-slate-500" title="options" onClick={() => setShowOptions((prev) => !prev)}>< BsThreeDots size={30}/></button>
                      
                      { showOptions && (
                          <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50 p-2">
                            <div className="w-full border borderBg max-w-[400px] max-h-[300px] p-3 rounded shadow-md bg-black text-white">
                              <button
                                  className="block w-full text-left py-3 px-2 border-b borderBg text-red-500 border-t hover:bg-[#2d2929] focus:outline-none"
                                  onClick={() => { setShowConfirmation(true); setShowOptions((prev) => !prev) }}
                                >
                               <div className="flex items-center gap-4">
                                  <MdDeleteOutline size={30} className="mr-2 inline-block" />
                                  <span>delete</span>
                                  </div>
                                </button>
                                <button
                                  className="block w-full text-left py-3 px-2 border-b borderBg  border-t hover:bg-[#2d2929] focus:outline-none"
                                  
                                >
                                <div className="flex items-center gap-4">
                                  < BiSolidEditAlt size={30} className="mr-2 inline-block" />
                                  <span>edit</span>
                                  </div>
                                </button>
                              
                              <button
                                onClick={() => setShowOptions((prev) => !prev)}
                                className="block w-full text-left hover:bg-[#2d2929] py-3 px-2 border-b borderBg focus:outline-none"
                              >
                                <div className="flex items-center gap-4">
                                  <MdClose size={30}/> 
                                  <span>back</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                     
                      {showConfirmation && (
                          <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50 p-2">
                              <div className="bg-white p-4 rounded shadow-md">
                                  <p className="text-lg text-black">Are you sure you want to delete this post?</p>
                                  <div className="flex justify-end mt-4">
                                      <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded" onClick={handleDeletePost}>Confirm</button>
                                      <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => setShowConfirmation(false)}>Cancel</button>
                                  </div>
                              </div>
                          </div>
                      )}
                      
                    </div>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="lg:flex w-full h-full lg:flex-col hidden bg-black">
                    <div className="p-4">
                      {selectedPost.caption}
                    </div>
                  </div>
                </div>

                {/* Close Icon */}
                <div onClick={() => setIsPostSelected(false)} className="absolute hidden top-2 right-2 lg:flex text-white cursor-pointer">
                  <MdClose size={30} onClick={() => setShowPauseIcon(false)} />
                </div>

                <div onClick={() => setIsPostSelected(false)} className="flex w-full max-w-[700px] p-3 bg-black lg:hidden text-white cursor-pointer">
                  <IoMdArrowRoundBack size={30} onClick={() => setShowPauseIcon(false)} />
                </div>
              </div>
                 <div className="flex w-full max-w-[700px] flex-col lg:hidden bg-black overflow-y-auto h-full">
                    <div className="p-4">
                      {selectedPost.caption} 
                    </div>
                </div>
            </div>
          )}
       </main>
     );
  };
}

export default Profile;


