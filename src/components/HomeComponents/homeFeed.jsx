import React, { useState, useEffect, useRef} from 'react';
import { FiBarChart2 } from "react-icons/fi";
import { TbHeartShare } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { IoPersonCircleSharp } from "react-icons/io5";
import Explore from '../sideBarPages/explore';
import { FaCompass } from 'react-icons/fa';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { HashLoader, PulseLoader, FadeLoader } from 'react-spinners';
import { useAuthState } from 'react-firebase-hooks/auth';
import{ auth, db } from '../../firebase'
import { ImHeart } from "react-icons/im";
import { FiHeart } from "react-icons/fi";
import { useUserData } from '../../getUserData';
import { MdDeleteOutline, MdClose } from "react-icons/md";
import { FaCommentAlt } from "react-icons/fa";

const ImageCard = ({ user, post }) => {
  const [authenticatedUser] = useAuthState(auth);
  const videoRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { allUsersData } = useUserData();
  const [isCommenting, setIsCommenting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentsEndRef = useRef(null);
  const isPostDisabled = commentText.trim().length === 0;
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  // Handle Like
  const handleLike = async (event, likedPost, likedUser) => {
    if (event) {
      event.preventDefault();
    }

    if (!likedUser || !likedPost) {
      console.error("Liked user or liked post not found");
      return;
    }
  
    if (!likedPost.likes) {
      likedPost.likes = []; 
    }
  
    try {
      if (authenticatedUser && authenticatedUser?.uid) {
        if (likedPost?.likes.includes(authenticatedUser.uid)) {
          likedPost.likes = likedPost?.likes.filter((uid) => uid !== authenticatedUser.uid);
        } else {
          likedPost.likes.push(authenticatedUser.uid);
        }
  
        const userRef = doc(db, "users", likedUser?.uid);
        const updatedData = {
          posts: likedUser.posts
        };
  
        await updateDoc(userRef, updatedData);
        console.log('Document updated successfully');
      } else {
        console.error("User authentication failed.");
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  //  Handle Comment
  const handleComment = async (event, commentedPost, commentedUser) => {
    if (event) {
      event.preventDefault();
    }
    setIsCommenting(true)

    try {
      if (authenticatedUser && authenticatedUser.uid) {
        const newComment = {
          userId: authenticatedUser.uid,
          commentId: `${authenticatedUser.uid}-${Date.now()}`, 
          text: event.target.comment.value,
          timestamp: new Date().toISOString()
      };
      
        commentedPost.comments.push(newComment);
        const userRef = doc(db, "users", commentedUser?.uid);
        const updatedData = {
          posts: commentedUser.posts
        };
        await updateDoc(userRef, updatedData);
        setIsCommenting(false)
        setCommentText('')
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error("User authentication failed.");
    }
    }catch (error) {
      console.error('Error adding comment:', error);
    } 
  };

    // Handle Comment Delete
  const handleDeleteComment = async (event, commentId, postOwner) => {
      if (event) {
        event.preventDefault();
      }
      setIsDeletingComment(true)
     
       try {
         postOwner.posts.forEach(post => {
           post.comments = post.comments.filter(comment => comment?.commentId !== commentId);
         });
     
         const userRef = doc(db, "users", postOwner.uid);
         const updatedData = {
           posts: postOwner.posts
         };
         await updateDoc(userRef, updatedData);
         console.log("Comment deleted successfully.");
     }
        catch (error) {
         console.error('Error deleting comment:', error);
       } finally{
        setIsDeletingComment(false)
       }
    };
  
  // Show video
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play();
            entry.target.muted = true; 
          } else {
            entry.target.pause();
            entry.target.muted = true;
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);
  
// Logic for scrolling to the latest comment
  useEffect(() => {
    if (commentsEndRef.current) {
        if (post.comments.length > 4) {
            commentsEndRef.current.scrollTop = commentsEndRef.current.scrollHeight;
        }
    }
  }, [post.comments]);

  //  Format time
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

  return (
    <div className='w-full  p-4 border-t borderBg mb-2'>
      <div className='flex items-center '>
        <Link to={`/${user?.userName}`}>
        { user?.userPictureURL?
          <img className='object-cover aspect-square h-full max-h-16 max-w-16 rounded-full border-2 border-white' src={user?.userPictureURL} />
        : <div className='rounded-full bg-gray-300 flex items-center justify-center'><IoPersonCircleSharp size={60}/></div>
        } 
        </Link>
        <div className='ml-2 flex gap-2 items-center'>
            <Link to={`/${user?.userName}`}>
              <h1 className='font-bold text-xl'>{user?.fullName}</h1>
              <div className='flex gap-2 items-center'>
                <h2 className='text-gray-500 text-sm'>@{user?.userName}</h2>
                <p className="flex mr-4 text-gray-400">{formatTimestamp(post.timestamp)}</p>
              </div>
            </Link>
        </div>
      </div>
      <div className='flex mt-2 ml-2 justify-start max-w-[550px] overflow-hidden'>
        <div className="flex flex-col p-2">
            <h2>{post.caption}</h2>
            <p className="text-sm text-gray-500">{post.hashtag}</p>
         </div>
      </div>
      <div className='flex flex-col p-2 gap-5'>
      <div className='flex justify-center items-center'>
      <div className='flex w-full max-w-[500px] max-h-[600px] border borderBg'>
        {post.type === 'image' ? (
          
          <img
            src={post.media}
            className="object-cover aspect-square w-full h-full"
            loading='lazy'
          />
        ) : post.type === 'video' ? (
          <video
            ref={videoRef}
            className=" w-full h-full max-w-[500px] max-h-[570px]"
            autoPlay
            loop
            muted
            controls
            loading = "lazy"
          >
            <source src={post.media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : ''}
      </div>
        </div>
        <div className='flex justify-around'>
          <div className='flex items-center justify-center space-x-1' onClick={() => setShowCommentForm(prev => !prev)}>
            <FaCommentAlt  size={20} className='text-[#0b17ff] cursor-pointer' />
            <span className='text-xs text-gray-600'>{post?.comments?.length}</span>
         </div>

          <div className='flex items-center justify-center space-x-1' onClick={(event) => {
              handleLike(event, post, user);
              setIsAnimating(true);
          }}>
            <div className={post.likes.includes(authenticatedUser?.uid) ? (isAnimating ? 'heart-beat cursor-pointer flex text-[#ff0404] rounded-full justify-center items-center' : 'cursor-pointer rounded-full text-[#ff0404]') : 'cursor-pointer rounded-full'}>
                {post.likes.includes(authenticatedUser?.uid) ?
                    <ImHeart size={20} />
                    : <FiHeart size={20} />
                }
            </div>
            <span className='text-xs text-gray-600'>
                {post.likes.length}
            </span>
          </div>

          <div className='flex items-center justify-center space-x-1'>
            <FiBarChart2 size={20} className='cursor-pointer text-blue-500' />
            <span className='text-xs text-gray-600'>{post.impressions}</span>
          </div>

          <div className='flex items-center justify-center space-x-1 '>
            <TbHeartShare size={20} className='cursor-pointer text-purple-500' />
            <span className='text-xs text-gray-600'>{post.shares}</span>
          </div>
        </div>
      </div>

      {/* Add Comment */}
       <div className='flex flex-col w-full h-full justify-center items-center mt-2 overflow-hidden'>
         {showCommentForm && (
            <div className="flex justify-center items-center w-full h-full max-h-[400px] flex-col max-w-[500px] p-4 bg-black">
              <div className='flex w-full justify-between cursor-pointer items-center'>
                <h2 className="text-white text-xl font-bold">Comments</h2>
                <MdClose className='hover:text-cyan-300' onClick={() => setShowCommentForm(prev => ! prev)} size={25} title='close' />
              </div>
              <div ref={commentsEndRef} className="h-full w-full max-h-[350px] overflow-y-auto overflow-x-hidden justify-start items-start">
                <div className='flex h-full flex-col w-full'>
                  {post.comments.length !== 0 ? (
                    post?.comments?.map((comment) => {
                     const commenter = allUsersData?.find((u) => u.uid === comment.userId);
                       return (
                        <div key={comment.timestamp} className="flex w-full h-full items-start py-3 gap-3">
                          <Link to={`/${commenter?.userName}`} className='flex'>
                            <div className='relative w-12 h-12'>
                              {commenter?.userPictureURL ? (
                                <img className='h-full w-full object-cover rounded-full border-2' src={commenter?.userPictureURL} alt='' />
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
                              {(comment.userId === authenticatedUser?.uid || post.id.substring(0, 28) === authenticatedUser?.uid.substring(0, 28)) && (
                                <p onClick={(event) => handleDeleteComment(event, comment.commentId, user)} className="text-[#c803fff0] max-w-[70px] w-full cursor-pointer mr-3 hover:text-red-500">
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
           )}

          { showCommentForm && <form
                className='flex border-b bg-black borderBg w-full max-w-[500px] h-full max-h-[60px] items-center'
                onSubmit={(event) => handleComment(event, post, user)}
              >
                <input
                  name="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent h-10 px-2 outline-none"
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
            </form> }
        </div>
        
           {isDeletingComment ? (
               <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50 p-2">
                  <FadeLoader color='#F9008E' size={200} loading={true} /> 
                </div>
              ) : (
                ''
              )
            }
    </div>
  );
};

 const HomeFeed = () => {
  const [display, setDisplay] = useState(false);
  const [activeTab, setActiveTab] = useState('ForYou');
  const [allPosts, setAllPosts] = useState([]);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      const updatedPosts = [];
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.posts && Array.isArray(user.posts)) {
          user.posts.forEach((post) => {
            const postWithUser = {
              user: user,
              post: post
            };
            updatedPosts.push(postWithUser);
          });
        }
      });
      updatedPosts.sort((a, b) => new Date(b.post.timestamp) - new Date(a.post.timestamp));
      setAllPosts(updatedPosts);
    });
  
    return () => unsubscribe();
  }, []);

  return (
   <main className='flex flex-col items-center w-full h-full'>
     <div className='flex w-full items-center justify-between border-b borderBg'>
      <div
        onClick={() => {
          setDisplay(false);
          setActiveTab('ForYou');
        }}
        className={`flex md:hover:bg-[#464749] cursor-pointer justify-center items-center w-full h-14 ${activeTab === 'ForYou' ? 'active-tab' : ''}`}>
        <h1>Featured</h1>
      </div>
      <div
        onClick={() => {
          setDisplay(true);
          setActiveTab('Explore');
        }}
        className={`flex md:hover:bg-[#464749] cursor-pointer justify-center gap-2 items-center w-full h-14 ${activeTab === 'Explore' ? 'active-tab' : ''}`}>
        <FaCompass size={25} />
        <h1>Explore</h1>
      </div>
     </div>
    
      {!display ? 
        <div className='w-full h-full overflow-y-auto'>
          {allPosts.length !== 0 ? (
            <>
              {allPosts.map((postWithUser, index) => (
                <ImageCard key={index} user={postWithUser.user} post={postWithUser.post} />
              ))}
            </>
          ) : (
            <div className='flex justify-center items-center w-full h-full'>
              <HashLoader color='#F9008E' size={200} loading={true} /> 
            </div>
          )}
        </div> 
        : (
          <div className='flex w-full overflow-y-auto'>
            <Explore />
          </div>
        )
      }
    </main>
  );
};

export default HomeFeed;











