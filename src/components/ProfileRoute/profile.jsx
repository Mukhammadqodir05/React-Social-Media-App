import react, { useEffect, useState } from 'react';

const Profile = () => {
 
  return (
    <main className='flex flex-col w-full items-center justify-center h-full '>
      {/* ... (existing code) */}
      <div className='max-w-[900px] w-full h-full p-1'>
        <div className='w-full flex flex-col items-center space-y-4'>
          <div className='w-full rounded-md p-4'>
            {/* Profile Information */}
            <div className='flex items-center space-x-4'>
              <div className='w-20 h-20 rounded-full bg-gray-300'></div>
              <div>
                <h2 className='text-lg font-bold'>Muhammad</h2>
                <p className='text-sm'>@muhammad</p>
              </div>
            </div>
            <div>
             
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
// const [selectedPost, setSelectedPost] = useState(null);
  // const openPost = (post) => {
  //   setSelectedPost(post);
  // };

  // const closePost = () => {
  //   setSelectedPost(null);
  // };
  // {selectedPost && (
  //   <div className='fixed flex flex-col p-4 top-0 left-0 right-0 z-10 w-full h-full items-center justify-center bg-black' onClick={closePost}>
  //     <div className=' overflow-hidden justify-center items-center'>
  //       <img className=' w-full max-w-[700px] max-h-[600px] h-full object-cover' src={selectedPost} alt='' />
  // import { UsersData } from '../Data/HomeFeedData';
  //     </div>
  //     <div>
  //       <h1>What's up</h1>
  //     </div>
  //   </div>
  // )}

//   <div className='w-full flex justify-center items-center pb-10'>
//   <div className='ProfilePosts w-full gap-1 grid grid-cols-3 h-full sm:mb-14'>
//     {UsersData.map((user) => (
//     <div key={user.UserId} className='flex h-full justify-center items-center'>
//       <div
//          onClick={() => openPost(user.Posts)}
//          className='aspect-[1.1] h-full w-full overflow-hidden'
//       >
//          <img className='h-full w-full object-cover' src={user.Posts} alt=''/>
//       </div>
//     </div>
//   ))}
// </div>
// </div>
  


