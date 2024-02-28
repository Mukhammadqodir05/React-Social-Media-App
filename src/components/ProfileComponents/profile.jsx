import React, { useState, useEffect, useRef} from 'react';
import  FollowFunction from '../Hooks/FollowFunction'
import { useUserData } from '../../getUserData';
import { Link, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import{ auth, db, storage } from '../../firebase'
import { doc, updateDoc, onSnapshot, query, collection, where } from 'firebase/firestore';
import { deleteObject, ref } from "firebase/storage";
import { useAuthState } from 'react-firebase-hooks/auth';
import { IoPersonCircleSharp } from "react-icons/io5";
import { FadeLoader, PulseLoader } from 'react-spinners';
import { MdDeleteOutline, MdClose } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { LiaUserEditSolid } from "react-icons/lia";
import { BiSolidEditAlt } from "react-icons/bi";
import { TbPlayerPlayFilled } from "react-icons/tb";
import { SlUserFollowing } from "react-icons/sl";
import { ImHeart } from "react-icons/im";
import { FiHeart } from "react-icons/fi";
import { FaCommentAlt } from "react-icons/fa";
import LogOut from '../../Auth/logout';
import { IoSettingsSharp } from "react-icons/io5";

const Profile = () => {
  const {handleFollowAction, isFollowing} = FollowFunction()
  const {userProfile, allUsersData } = useUserData();
  const {username} = useParams();
  const currentUser = allUsersData?.find(user => user.userName === username);
  const [user] = useAuthState(auth);
  const [followersCount, setFollowersCount] = useState(currentUser?.followers.length);
  const [followingCount, setFollowingCount] = useState(currentUser?.following.length);
  const [postCount, setPostCount] = useState(currentUser?.posts.length);
  const [posts, setPosts] = useState(currentUser?.posts.map(post => post))
  const [isFollowed, setIsFollowed] = useState(userProfile[0]?.following.includes(currentUser?.uid));
  const [selectedPost, setSelectedPost] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [isPostSelected, setIsPostSelected] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editPosts, setEditPosts] = useState(false);
  const [updatedCaption, setUpdatedCaption] = useState('');
  const [updatedHashtag, setUpdatedHashtag] = useState('');
  const [userBanner, setUserBanner] = useState(currentUser?.userBannerURL);
  const [userName, setUserName] = useState(currentUser?.userName);
  const [userFollowing, setUserFollowing] = useState(currentUser?.following);
  const [showFollowing, setShowFollowing] = useState(false);
  const [userFollowers, setUserFollowers] = useState(currentUser?.followers);
  const [showFollowers, setShowFollowers] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentsEndRef = useRef(null);
  const isPostDisabled = commentText.trim().length === 0;
  const [previousCommentsLength, setPreviousCommentsLength] = useState(selectedPost?.comments?.length);
  const [ownerUser, setOwnerUser] = useState(null)

  // real-time database
  useEffect(() => {
    if (username) {
      const unsubscribe = onSnapshot(query(collection(db, "users"), where("userName", "==", username)), (snapshot) => {
        snapshot.forEach((doc) => {
          const userData = doc.data();
          setOwnerUser(userData);
        });
      });
  
      return () => unsubscribe();
    }
  }, [username]);

   
  const formatTimestamp = (timestamp) => {
    const timeDiff = new Date() - new Date(timestamp);
    const seconds = Math.floor(timeDiff / 1000);
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const day = Math.floor(hours / 24);
    if (day === 1) {
      return `${day} day ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
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

  // Add a comment
  const handleComment = async (event, commentedPost) => {
    if (event) {
      event.preventDefault();
    }
    setIsCommenting(true);

    try {
        const userRef = doc(db, "users", ownerUser?.uid);
        const newComment = {
          userId: user.uid,
          commentId: `${ownerUser?.uid}-${Date.now()}`,
          text: event.target.comment.value,
          timestamp: new Date().toISOString()
        };

        const updatedPost = {
          ...commentedPost,
          comments: [...commentedPost.comments, newComment]
        };

        await updateDoc(userRef, {
          posts: ownerUser?.posts?.map(post => post.id === commentedPost.id ? updatedPost : post)
        });

        commentedPost.comments.push(newComment);
        setPreviousCommentsLength(commentedPost.comments.length); 
        setIsCommenting(false);
        setCommentText('');
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error('Error adding comment:', error);
    } 
  };

  // Handle Comment Delete
  const handleDeleteComment = async (event, commentId) => {
    if (event) {
        event.preventDefault();
    }
    setIsDeletingComment(true)

    const userRef = doc(db, "users", ownerUser?.uid);
    let updatedData = {};

    try {
          ownerUser.posts.forEach(post => {
            const commentsArray = post.comments;
            if (commentsArray) {
                post.comments = commentsArray.filter(comment => comment?.commentId !== commentId);
            }
        });
        
        updatedData = {
          posts:  ownerUser?.posts
        };
        await updateDoc(userRef, updatedData);
       
        console.log("Comment deleted successfully.");
    } catch (error) {
        console.error('Error deleting comment:', error);
    } finally{
      setIsDeletingComment(false)
      setSelectedPost({
        ...selectedPost,
        comments: selectedPost.comments.filter(comment => comment?.commentId !== commentId)
      });

    }
};


// Logic for scrolling to the latest comment
  useEffect(() => {
    if (commentsEndRef.current) {
        if (selectedPost?.comments.length >= previousCommentsLength) {
          commentsEndRef.current.scrollTop = commentsEndRef.current.scrollHeight;
        }
      }
    }, [selectedPost?.comments, previousCommentsLength]);
    

//  Real-time database
  useEffect(() => {
      const unsubscribe = onSnapshot(doc(db, "users", currentUser?.uid), (doc) => {
        setFollowersCount(doc.data().followers.length);
        setFollowingCount(doc.data().following.length);
        setIsFollowed(doc.data().followers.includes(userProfile[0]?.uid));
        setPostCount(doc.data().posts.length);
        setPosts(doc.data().posts.map(post => post).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        setUserBanner(doc.data().userBannerURL);
        setUserName(doc.data().userName)
        setUserFollowing(doc.data().following)
        setUserFollowers(doc.data().followers)
      });
    
      return () => unsubscribe();
  }, [user.uid, currentUser?.uid]);


    // Handle Like
  const handleLike = async (event, likedPost) => {
      if (event) {
          event.preventDefault();
      }
  
      try {
          if (user && user?.uid) {
              const updatedLikes = likedPost.likes.includes(user.uid)
                  ? likedPost.likes.filter((uid) => uid !== user.uid)
                  : [...likedPost.likes, user.uid];
  
                  
                  const userRef = doc(db, "users", ownerUser?.uid);
                  const updatedData = {
                    posts: ownerUser?.posts.map(post => post.id === likedPost.id ? { ...post, likes: updatedLikes } : post)
                  };
                  setSelectedPost({
                      ...selectedPost,
                      likes: updatedLikes
                  });

              await updateDoc(userRef, updatedData);
              setIsAnimating(false);
              console.log('Document updated successfully');
          } else {
              console.error("User authentication failed.");
          }
      } catch (error) {
          console.error('Error updating document:', error);
      }
  };
  
  // Delete The Post
  const handleDeletePost = async (e) => {
    e.preventDefault()
    setIsDeletingComment(true)
    try {
        setShowConfirmation(false);
        const userRef = doc(db, "users", user?.uid);
       
        if (clickedIndex !== -1) {
            const postToDelete = ownerUser?.posts[clickedIndex];
            const mediaUrl = postToDelete.media;
            const storageRef = ref(storage, mediaUrl);
            await deleteObject(storageRef);

            // Remove the post from the posts array using splice
            posts.splice(clickedIndex, 1);

            const updatedData = {
                posts: ownerUser?.posts,
            };

            await updateDoc(userRef, updatedData);
            console.log('Post and media deleted successfully');
            setIsPostSelected(false);
        } else {
            console.log('Post not found in the user\'s posts array');
        }
    } catch (error) {
        console.error('Error deleting post or media:', error);
    } finally{
      setIsDeletingComment(false)
    }
  };

// Edit The Post
  const handleEditPost = async (e) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", user?.uid);

      if (clickedIndex !== -1) {
        const postToEdit = ownerUser?.posts[clickedIndex];

        if (postToEdit) {
          postToEdit.caption = updatedCaption;
          postToEdit.hashtag = updatedHashtag;

          const updatedData = {
            posts: ownerUser?.posts,
          };

          await updateDoc(userRef, updatedData);
          setEditPosts((prev) => !prev);
          setIsPostSelected(false);
          console.log('Post edited successfully');
        } else {
          console.log('Post not found in the user\'s posts array');
        }
      } else {
        console.log('Invalid clickedIndex value');
      }
    } catch (error) {
      console.error('Error editing post:', error);
    } 
  };

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
  
  return (
   <main className="flex flex-col w-full items-center justify-center h-full pt-0">
     { userName === username ?  
       <>
         <div className="max-w-[900px] w-full h-full">
            <div className="flex gap-10 items-center w-full h-14 p-2">
              <Link className="hover:bg-[#363535] rounded-full p-2" title="Back to home" to='/'><IoMdArrowRoundBack  size={30}/></Link>
                <h1 className="text-xl cursor-pointer font-medium">{currentUser.fullName}</h1>
                </div>
                <div className="w-full h-full overflow-y-auto pb-9">
                  <div className="relative ">
                  <div className=" flex justify-center items-center w-full h-full max-h-[200px]">
                    { userBanner ? (
                        <img className="w-full max-w-[650px] object-cover aspect-square h-full max-h-[200px]" src={userBanner} alt="" />
                      ) : (<h1 className="w-full max-w-[650px] object-cover aspect-square h-full max-h-[200px] bg-[#524444]" />
                      )}
                    </div>
                    <div className="p-2 absolute w-full flex justify-between gap-2">
                    { currentUser.userPictureURL? (
                      <img
                        className="w-full mt-[-73px] bg-black object-cover aspect-square h-full max-h-36 max-w-36 rounded-full border-2 border-white"
                        src={currentUser.userPictureURL}
                      />
                    ) : (<div
                        className="w-full flex justify-center items-center mt-[-73px] bg-black aspect-square h-full max-h-32 max-w-32 rounded-full border-4"
                    ><IoPersonCircleSharp className="flex w-full h-full"/></div>)}
                        { username === userName && (
                        <div className="relative mt-4">
                          { username !== userProfile[0]?.userName && (
                            <button onClick={handleFollowAction} className="bg-white follow px-4 p-3 mr-2 rounded-full">
                            { !isFollowing? ( isFollowed? <SlUserFollowing size={25} /> : 'FOLLOW')
                             : (
                              <div className="flex gap-2 animate-bounce ">
                                <h1 className="bg-white rounded-full p-2" />
                                <h1 className="bg-white rounded-full p-2" />
                                <h1 className="bg-white rounded-full p-2" />
                              </div>
                             )}
                            </button>
                          )} 
                        { username === userProfile[0].userName && (              
                          <div title='options' onClick={() => setShowSettings(prev =>! prev)} className='text-white text-4xl cursor-pointer m2-5'>
                            <IoSettingsSharp />
                          </div>
                        )}
                        </div>
                      )}
                     </div>
                    </div>
                     
                    { showSettings && (
                      <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50 p-2">
                        <div className="w-full border borderBg max-w-[400px] max-h-[300px] p-3 rounded shadow-md bg-[#000000] text-white">
                          <button
                            className="block w-full text-left py-3 px-2 border-b borderBg text-red-500 border-t hover:bg-gray-800 focus:outline-none"
                            onClick={() => { setShowConfirmation(true); setShowOptions((prev) => !prev) }}
                          >
                            <div className="flex items-center gap-4">
                              <LogOut />
                              <span className='flex xl:hidden'>Log Out</span>
                            </div>
                          </button>
                          
                          <button className="w-full text-left py-3 px-2 border-b borderBg hover:bg-gray-800 focus:outline-none">
                            <Link to={`/${currentUser?.userName}/edit`} className='flex gap-4'>
                              <LiaUserEditSolid title="Edit" size={30} />
                              <span>Edit</span>
                            </Link>
                          </button>

                          <button
                            onClick={() => setShowSettings((prev) => !prev)}
                            className="block w-full text-left hover:bg-gray-800 py-3 px-2 border-b borderBg focus:outline-none"
                          >
                            <div className="flex items-center gap-4">
                              <MdClose size={30}/> 
                              <span>Back</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}


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
                        { currentUser.location?
                          <p>📍{currentUser.location}</p>
                        :''}
                      </div>
                    </div>
                  </div>
              

                  <div className="flex p-2 gap-5 mt-2 max-w-[400px] overflow-hidden ">
                    <div onClick={() => setShowFollowing(true)} title="following" className="flex cursor-pointer gap-1">
                      <p className="font-bold">{formattedFollowing}</p>
                      <p className="text-gray-500">Following</p>
                    </div>
                    <div onClick={() => setShowFollowers(true)} title="followers" className="flex cursor-pointer gap-1">
                      <p className="font-bold">{formattedFollowers}</p>
                      <p className="text-gray-500">Followers</p>
                    </div>
                    <div title="posts" className="flex gap-1 cursor-pointer">
                      <p className="font-bold">{postCount}</p>
                      <p className="text-gray-500">Posts</p>
                    </div>
                  </div>


                {/* Posts here */}
                  <div className="flex w-full border-t borderBg border-gray-300 "></div>
                    {posts.length !== 0 ? (
                      <div className="grid grid-cols-3 gap-1 w-full p-1 pb-20">
                        {posts.map((post, index) => (
                          <div key={post.id} className="relative">
                            {post.type === 'image' ? (
                              <img
                                  onClick={() => handleImageClick(post, index)}
                                  src={post.media}
                                  className="object-cover aspect-square w-full h-full cursor-pointer"
                                  loading = 'lazy'
                              />
                            ) : post.type === 'video' ? (
                                <video
                                  className="object-cover aspect-square w-full h-full cursor-pointer"
                                  onClick={() => handleVideoClick(post, index)}
                                  loading = 'lazy'
                                >
                                  <source src={post.media} type="video/mp4" />
                              </video>
                            ) : null}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex p-2 justify-center items-center w-full sm:h-40 h-28">
                        <h1 className="font-bold text-xl text-gray-400">
                            Looks like there are no posts yet 🤔
                        </h1>
                      </div>
                    )}
                  </div>
                </div>
      
            {/* Show The Selected Post */}
                
           { isPostSelected && (
              <div className="fixed flex-col top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-90 z-50">
               {/* Close Icon */}
                <div onClick={() => setIsPostSelected(false)} className="flex gap-5 w-full max-w-[600px] p-4 border-b borderBg bg-black lg:hidden text-white cursor-pointer overflow-hidden ">
                  <IoMdArrowRoundBack size={30} onClick={() => setShowPauseIcon(false)} />
                  <h2 className="text-white text-xl font-bold">Post</h2>
                </div>
                 <div className='flex flex-col items-center lg:justify-center h-full w-full overflow-y-auto overflow-x-hidden'>
                  <div className="flex lg:mt-0 bg-black w-full max-w-[600px] lg:max-w-[1140px] flex-col-reverse lg:flex-row  overflow-y-auo lg:overflow-hidden">
                  <div className="w-full border-b lg:border borderBg flex flex-col justify-center items-center relative">
                      {showPauseIcon && 
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
                              <source src={selectedPost.media} type="video/mp4" />
                          </video>
                      ) : selectedPostType === 'image' ? (
                          <img className="object-cover w-full h-full aspect-square" src={selectedPost.media} alt="Selected Post" />
                      ) : null }
                  </div>

                    {/* Comments, Delete Button, Owner Profile Section */}
                    <div className="flex flex-col w-full max-w-[700px] h-full lg:border-r borderBg lg:max-w-[500px] justify-between items-center bg-black">
                      <div className="flex lg:border lg:border-r-0 lg:border-l-0 borderBg w-full max-w-[700px] max-h-24 lg:max-w-[500px] justify-between items-center p-2">
                       <div className='flex gap-2 items-center'>
                        <Link to={`/${userProfile[0]?.userName}`} className="flex items-center">
                          {currentUser?.userPictureURL ? (
                            <img className='object-cover aspect-square h-full max-h-14 max-w-14 rounded-full border-2' src={currentUser?.userPictureURL} alt='' />
                          ) : (
                            <div className='rounded-full bg-gray-300 flex items-center justify-center'><IoPersonCircleSharp size={40} /></div>
                          )}
                          <span className="ml-2 max-w-[300px] w-full overflow-hidden overflow-ellipsis text-nowrap">{currentUser.fullName}</span>
                        </Link>
                          { username === userProfile[0].userName && (
                          <div className='flex '>
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
                                      onClick={() => {setShowOptions((prev) => !prev); setEditPosts((prev) => !prev)}}
                                    >
                                      <div className="flex items-center gap-4">
                                        <BiSolidEditAlt size={30} className="mr-2 inline-block" />
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
                          <div onClick={() => setIsPostSelected(false)} className="lg:flex rounded-full hover:bg-slate-500 hidden p-2 cursor-pointer text-[#ffffff] z-10">
                            <MdClose title='close' size={30} onClick={() => setShowPauseIcon(false)} />
                        </div>
                      </div>

                      {/* Comments Section */}
                    <div className="lg:flex w-full h-full lg:flex-col hidden bg-black">
                     <div className="flex flex-col p-5 mt-[-20px] mb-[-20px] gap-2 ">
                     <div className='lg:flex hidden flex-col w-full h-full justify-center items-center overflow-hidden'>
                      <div className="flex justify-center items-center w-full flex-col h-[455px]">
                        <div ref={commentsEndRef} className="h-full w-full justify-start items-start max-h-[455px] overflow-y-auto overflow-x-hidden">
                          <div className=''>
                            <h2>{selectedPost.caption}</h2> 
                            <p className="text-sm text-gray-500">{selectedPost.hashtag}</p>
                          </div>
                          <div className='flex flex-col w-full'>
                            {selectedPost?.comments?.length !== 0 ? (
                              selectedPost?.comments?.map((comment, index) => {
                                const commenter = allUsersData?.find((u) => u.uid === comment.userId);
                                return (
                                  <div key={comment.timestamp} className={`flex w-full h-full items-start py-3 gap-3 ${index > 1 ? 'mt-2' : ''}`}>
                                    <Link onClick={() => setIsPostSelected(false)} to={`/${commenter?.userName}`} className='flex'>
                                      <div className='relative w-10 h-10'>
                                        {commenter?.userPictureURL ? (
                                          <img className='object-cover aspect-square h-full max-h-16 max-w-16 rounded-full border-2 border-white' src={commenter?.userPictureURL}/>
                                        ) : (
                                          <div className='rounded-full bg-gray-300 flex items-center justify-center h-full'>
                                            <IoPersonCircleSharp size={50}/>
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                    <div className='flex h-full justify-start flex-col w-full'>
                                      <div className='flex items-center w-full gap-2'>
                                        <p className='text-nowrap font-medium overflow-hidden text-ellipsis'>{commenter?.userName}</p>
                                        {(comment.userId === user?.uid || currentUser.userName === userProfile[0]?.userName) && (
                                            <p onClick={(event) => handleDeleteComment(event, comment.commentId, ownerUser)} className="text-[#c803fff0] max-w-[70px] w-full cursor-pointer mr-3 hover:text-red-500">
                                              <MdDeleteOutline title='delete this comment' size={25}/>
                                            </p>
                                          )}

                                      </div>
                                      <div className='flex w-full h-full flex-col gap-2 overflow-x-hidden'>
                                        <p className="text-gray-100 mt-1" style={{ wordWrap: 'break-word' }}>{comment.text}</p>
                                        <p className="flex mr-4 text-gray-400 text-xs">{formatTimestamp(comment.timestamp)}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className='flex w-full justify-center items-center h-[100px]'>
                                Be the first to share your thoughts.
                              </div>
                            )}
                          </div>
                        </div>
                       </div>
                      </div>

                    <div className='lg:flex hidden items-center pl-5 gap-10 w-full h-[60px]'>
                      {/* Comment Button*/}
                        <div className='hidden lg:flex items-center justify-center space-x-1'>
                          <FaCommentAlt  size={20} className='text-[#0b17ff] cursor-pointer' />
                          <span className='text-gray-600'>{selectedPost?.comments?.length} comments</span>
                       </div>
                {/* Like Button */}
                          <div className='flex items-center justify-center space-x-1' onClick={(event) => {
                                handleLike(event, selectedPost);
                                setIsAnimating(true);
                            }}>
                           <div className={selectedPost.likes.includes(user?.uid) ? (isAnimating ? 'heart-beat cursor-pointer flex text-[#ff0404] rounded-full justify-center items-center' : 'cursor-pointer rounded-full text-[#ff0404]') : 'cursor-pointer rounded-full'}>
                              {selectedPost.likes.includes(user?.uid) ?
                                  <ImHeart size={20} />
                                  : <FiHeart size={20} />
                              }
                           </div>
                          <span className='text-gray-600'>
                              {selectedPost.likes.length} likes
                          </span>
                        </div>
                       <p className='text-sm text-gray-500'>{formatTimestamp(selectedPost?.timestamp)}</p>
                      </div>
                     </div>
                      </div>
                       <form
                        className='border-t border-b lg:flex hidden bg-black borderBg w-full h-[60px] items-center'
                        onSubmit={(event) => handleComment(event, selectedPost, ownerUser)}
                          >
                            <input
                              name="comment"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="w-full bg-transparent h-20 px-2 outline-none"
                              placeholder="Add a comment..."
                              autoComplete='off'
                            />
                            <button
                              type="submit"
                              className={`px-4 py-2 w-[80px] h-[40px] cursor-pointer ${isPostDisabled ? 'text-gray-500' : 'text-green-500'}`}
                              disabled={isPostDisabled}
                              title='post a comment'
                            >
                              {isCommenting ? (
                                <div className="flex items-center justify-center cursor-pointer">
                                  <PulseLoader color='#F9008E' size={15} loading={true} />
                                </div>
                              ) : (
                                <h1 className='text-xl font-medium'>
                                   Post
                                </h1>
                              )}
                            </button>
                      </form> 
                    </div>
                    </div>

                {/*Mobile Design   */}
                  <div className="flex w-full max-w-[600px] flex-col lg:hidden bg-black h-full pb-11">
                    <div className="flex flex-col w-full h-full p-2">
                      <h2>{selectedPost.caption}</h2>
                      <p className="text-sm text-gray-500">{selectedPost.hashtag}</p>
                   {/* Mobile Responsive Like and Comment */}
                        <div className='flex items-center gap-5 p-4'>
                    {/* Like Button */}
                            <div className='flex items-center justify-center space-x-1' onClick={(event) => {
                              handleLike(event, selectedPost, ownerUser);
                              setIsAnimating(true);
                              }}>
                              <div className={selectedPost.likes.includes(user?.uid) ? (isAnimating ? 'heart-beat cursor-pointer flex text-[#ff0404] rounded-full justify-center items-center' : 'cursor-pointer rounded-full text-[#ff0404]') : 'cursor-pointer rounded-full'}>
                                {selectedPost.likes.includes(user?.uid) ?
                                    <ImHeart size={20} />
                                    : <FiHeart size={20} />
                                }
                              </div>
                            <span className='text-gray-600'>
                                {selectedPost.likes.length} likes
                            </span>
                          </div>
                    {/* Comment icon */}
                            <div className='flex items-center justify-center space-x-1'>
                                <FaCommentAlt onClick={() => setShowCommentForm(prev =>! prev)} title='open comments'  size={20} className='text-[#0b17ff] cursor-pointer' />
                                <span className='text-gray-600'>{selectedPost?.comments?.length} comments</span>
                            </div>
                            <p className='text-sm text-gray-500'>{formatTimestamp(selectedPost?.timestamp)}</p>
                         </div>
                        </div>
                     </div>
                  </div>
                </div>
               )}
                
            {/* Mobile Responsive Comment section */}
          { showCommentForm &&
            <div className="fixed top-0 left-0 z-50 lg:hidden w-full h-screen flex flex-col items-center justify-center bg-opacity-50 bg-black">
             <div className="flex w-full h-screen max-w-[600px] lg:max-w-[1140px] flex-col bg-black">
               <div className="flex gap-5 w-full border-b borderBg max-w-[600px] p-4 bg-black text-white cursor-pointer overflow-hidden ">
                 <IoMdArrowRoundBack 
                    onClick={() => setShowCommentForm(prev =>! prev)}
                    className='hover:bg-slate-800 rounded-full' 
                    title='back' size={30}
                  />
                    <h2 className="text-white text-xl font-bold ml-[100px] ">Comments</h2>
                  </div>
                { showCommentForm &&  
                  <div className="flex justify-center items-center w-full flex-col">
                    <div ref={commentsEndRef} className="h-full p-5 w-full justify-start items-start max-h-[600px] overflow-y-auto overflow-x-hidden">
                      <div>
                        <h2>{selectedPost.caption}</h2> 
                        <p className="text-sm text-gray-500">{selectedPost.hashtag}</p>
                      </div>
                      <div className='flex flex-col w-full'>
                        {selectedPost?.comments?.length !== 0 ? (
                          selectedPost?.comments?.map((comment, index) => {
                            const commenter = allUsersData?.find((u) => u.uid === comment.userId);
                            return (
                              <div key={comment.timestamp} className={`flex w-full h-full items-start py-3 gap-3 ${index > 1 ? 'mt-2' : ''}`}>
                                   <Link to={`/${commenter?.userName}`} className='flex'>
                                  <div onClick={() => {setShowCommentForm(prev =>! prev); setIsPostSelected(false)}} className='relative w-10 h-10'>
                                    {commenter?.userPictureURL ? (
                                      <img  className='h-full w-full object-cover aspect-square rounded-full border-2' src={commenter?.userPictureURL} alt='' />
                                    ) : (
                                      <div className='rounded-full bg-gray-300 flex items-center justify-center h-full'>
                                        <IoPersonCircleSharp size={50}/>
                                      </div>
                                    )}
                                  </div>
                                   </Link>
                                <div className='flex h-full justify-start flex-col w-full'>
                                  <div className='flex items-center w-full gap-2'>
                                    <p className='text-nowrap font-medium overflow-hidden text-ellipsis'>{commenter?.userName}</p>
                                    {(comment.userId === user?.uid || currentUser.userName === userProfile[0]?.userName) && (
                                        <p onClick={(event) => handleDeleteComment(event, comment.commentId, ownerUser)} className="text-[#c803fff0] max-w-[70px] w-full cursor-pointer mr-3 hover:text-red-500">
                                          <MdDeleteOutline title='delete this comment' size={25}/>
                                        </p>
                                      )}

                                  </div>
                                  <div className='flex w-full h-full flex-col gap-2 overflow-x-hidden'>
                                    <p className="text-gray-100 mt-1" style={{ wordWrap: 'break-word' }}>{comment.text}</p>
                                    <p className="flex mr-4 text-gray-400 text-xs">{formatTimestamp(comment.timestamp)}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className='flex w-full justify-center items-center h-[100px]'>
                            Be the first to share your thoughts.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                }
              </div>

              <form
                className='flex border-t bg-black borderBg w-full max-w-[600px] h-[60px] items-center'
                onSubmit={(event) => handleComment(event, selectedPost, ownerUser)}
              >
                <input
                  name="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent h-20 px-2 outline-none"
                  placeholder="Add a comment..."
                  autoComplete='off'
                />
                <button
                  type="submit"
                  className={`px-4 py-2 w-[80px] h-[40px] cursor-pointer ${isPostDisabled ? 'text-gray-500' : 'text-green-500'}`}
                  disabled={isPostDisabled}
                  title='post a comment'
                >
                  {isCommenting ? (
                    <div className="flex items-center justify-center cursor-pointer">
                      <PulseLoader color='#F9008E' size={15} loading={true} />
                    </div>
                  ) : (
                    <h1 className='text-xl font-medium'>
                      Post
                    </h1>
                  )}
                </button>
              </form> 
             </div>
             }
             
              {isDeletingComment ? (
               <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50 p-2">
                  <FadeLoader color='#F9008E' size={200} loading={true} /> 
                </div>
              ) : (
                ''
              )
            }
            
            {/* Edit The Selected Post */}
                { editPosts && (
                  <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50 p-2">
                    <div className="w-full flex flex-col justify-center max-w-[425px] h-full max-h-[400px] p-4 rounded shadow-md bg-gray-800 text-white">
                      <div className="flex justify-end mt-[-50px] text-white cursor-pointer">
                        <MdClose size={30} onClick={() => setEditPosts(false)} />
                      </div>
                      <h2 className="text-2xl font-bold mb-4 text-center mt-[15px]">Edit Post</h2>
                      <form onSubmit={handleEditPost} className="flex flex-col gap-4">
                        <label className="text-lg">Edit The Caption:</label>
                        <input
                          className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none"
                          type="text"
                          value={updatedCaption}
                          onChange={(e) => setUpdatedCaption(e.target.value)}
                        />
                        <label className="text-lg">Edit The Hashtags :</label>
                        <input
                          className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none"
                          type="text"
                          value={updatedHashtag}
                          onChange={(e) => setUpdatedHashtag(e.target.value)}
                        />

                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded">
                          Update Post
                        </button>
                      </form>
                    </div>
                  </div>
                )}
          </> : (
            <div className='flex w-full h-screen justify-center items-center'>
              <FadeLoader color='#F9008E' loading={true} /> 
          </div>
          )}

        {/* Show following accounts here */} 
          { showFollowing && 
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 z-50 p-2">
              <div className="flex flex-col bg-[#252525] w-full max-w-[400px] h-full max-h-[500px] rounded-lg overflow-hidden">
                <div className="flex flex-col justify-between items-center">
                  <div className="flex w-full justify-between items-center p-3">
                    <h2 className="text-white text-xl font-bold">Following</h2>
                    <MdClose title="close" size={30} className="cursor-pointer rounded-full  hover:bg-slate-600 text-white" onClick={() => setShowFollowing(false)} />
                  </div>
                  <div className="flex w-full border-b borderBg" />
                </div>
                <div className="p-2 overflow-y-auto pb-5">
                {userFollowing.length > 0 ? (
                  userFollowing.map((userId, index) => {
                    const followedUser = allUsersData?.find(user => user.uid === userId);
                    return (
                      <div key={userId} className="flex items-center justify-between p-2 border-b border-gray-800">
                        <div onClick={() => setShowFollowing(false)} className="flex items-center gap-4 cursor-pointer">
                          <Link to={`/${followedUser?.userName}`}>
                            {followedUser?.userPictureURL ? 
                              <img
                                src={followedUser?.userPictureURL}
                                alt={followedUser?.fullName}
                                className="rounded-full h-10 w-10"
                              /> 
                              : <div className="rounded-full bg-gray-300 flex items-center justify-center h-10 w-10"><IoPersonCircleSharp size={40} /></div>
                            }
                          </Link>
                          <div>
                            <Link to={`/${followedUser?.userName}`}>
                              <p className="text-white font-bold">{followedUser?.fullName}</p>
                              <p className="text-gray-500 text-base">@{followedUser?.userName}</p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex font-bold text-xl justify-center items-center h-[400px] w-full text-white">
                    No following yet
                  </div>
                )}
                </div>
              </div>
            </div>
          }

          {/* Show followers accounts here */} 
          { showFollowers && 
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 z-50 p-2">
              <div className="flex flex-col bg-[#252525] w-full max-w-[400px] h-full max-h-[500px] rounded-lg overflow-hidden">
                <div className="flex flex-col justify-between items-center">
                  <div className="flex w-full justify-between items-center p-3">
                    <h2 className="text-white text-xl font-bold">Followers</h2>
                    <MdClose title="close" size={30} className="cursor-pointer rounded-full  hover:bg-slate-600 text-white" onClick={() => setShowFollowers(false)} />
                  </div>
                  <div className="flex w-full border-b borderBg" />
                </div>
                <div className="p-2 overflow-y-auto pb-5">
                { userFollowers.length > 0 ? (
                  userFollowers.map((userId, index) => {
                    const followerUser = allUsersData?.find(user => user.uid === userId);
                    return (
                      <div key={userId} className="flex items-center justify-between p-2 border-b border-gray-800">
                        <div onClick={() => setShowFollowers(false)} className="flex items-center gap-4 cursor-pointer">
                          <Link to={`/${followerUser?.userName}`}>
                            {followerUser?.userPictureURL ? 
                              <img
                                src={followerUser?.userPictureURL}
                                alt={followerUser?.fullName}
                                className="rounded-full h-10 w-10"
                              /> 
                              : <div className="rounded-full bg-gray-300 flex items-center justify-center h-10 w-10"><IoPersonCircleSharp size={40} /></div>
                            }
                          </Link>
                          <div>
                            <Link to={`/${followerUser?.userName}`}>
                              <p className="text-white font-bold">{followerUser?.fullName}</p>
                              <p className="text-gray-500 text-base">@{followerUser?.userName}</p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex font-bold text-xl justify-center items-center h-[400px] w-full text-white">
                    No followers yet
                  </div>
                )}
                </div>
              </div>
            </div>
          }
    </main>
  );
}

export default Profile;


