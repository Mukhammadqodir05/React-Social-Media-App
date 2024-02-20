import React, { useRef, useEffect, useState } from 'react';
import { GoComment } from "react-icons/go";
import { FiBarChart2 } from "react-icons/fi";
import { TbHeartShare } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { IoPersonCircleSharp } from "react-icons/io5";
import Explore from '../sideBarPages/explore';
import { FaCompass } from 'react-icons/fa';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { HashLoader } from 'react-spinners';
import { useAuthState } from 'react-firebase-hooks/auth';
import{ auth, db } from '../../firebase'
import { ImHeart } from "react-icons/im";
import { FiHeart } from "react-icons/fi";

const ImageCard = ({ user, post }) => {
  const [authenticatedUser] = useAuthState(auth);
  const videoRef = useRef(null);

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

  return (
    <div className='w-full p-4 border-t borderBg mb-2'>
      <div className='flex items-center '>
        <Link to={`/${user?.userName}`}>
        { user?.userPictureURL?
          <img className='h-12 w-12 rounded-full border-2' src={user?.userPictureURL} alt='' />
        : <div className='rounded-full bg-gray-300 flex items-center justify-center'><IoPersonCircleSharp size={50}/></div>
        } 
        </Link>
        <div className='ml-2 flex gap-2 items-center'>
            <Link to={`/${user?.userName}`}>
              <h1 className='font-bold text-xl'>{user?.fullName}</h1>
              <h2 className='text-gray-500 text-sm'>@{user?.userName}</h2>
            </Link>
        </div>
      </div>
      <div className='flex mt-2 ml-2 justify-start max-w-[550px] overflow-hidden'>
        <div className="flex flex-col p-2">
            <h2>{post.caption}</h2>
            <p className="text-sm text-gray-500">{post.hashtag}</p>
         </div>
      </div>
      <div className='flex flex-col p-2 gap-7'>
      <div className='flex justify-center items-center'>
      <div className='flex w-full max-w-[500px] max-h-[600px] border borderBg p-2 rounded-[10px]'>
      {post.type === 'image' ? (
        
        <img
          src={post.media}
          className="object-cover aspect-square w-full h-full"
        />
       ) : post.type === 'video' ? (
        <video
          ref={videoRef}
          className=" w-full h-full max-w-[500px] max-h-[570px]"
          autoPlay
          loop
          muted
          controls
        >
          <source src={post.media} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : ''}
    </div>
        </div>
        <div className='flex justify-around'>
          <div className='flex items-center justify-center space-x-1'>
            <GoComment size={20} className='curtext-gray-600 cursor-pointer' />
            <span className='text-xs text-gray-600'> Comments</span>
          </div>

          <div className='flex items-center justify-center space-x-1' onClick={(event) => {
              handleLike(event, post, user);
          }}>
              <div className={post.likes.includes(authenticatedUser?.uid) ? 'heart-beat cursor-pointer flex text-[#ff0404] rounded-full justify-center items-center ' : 'cursor-pointer rounded-full'}>
                  {post.likes.includes(authenticatedUser?.uid) ?
                      <ImHeart size={20} />
                  : (
                    <FiHeart size={20} />
                   )
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











