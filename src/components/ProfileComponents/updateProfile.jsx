import React, { useRef, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserData } from '../../getUserData';
import { TbCameraPlus } from "react-icons/tb";
import { Link,useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { ref, uploadString, getDownloadURL } from 'firebase/storage'

const UpdateProfile = () => {
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedBanner, setSelectedBanner] = useState('')
  const {allUsersData} = useUserData(); 
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const fileRef = useRef(null);
  const bannerFileRef = useRef(null);
  const { username } = useParams();
  const currentUser = allUsersData?.find(user => user.userName === username);
 
  // FULLNAME limitation
  const MAX_FULLNAME_LENGTH = 35;
  const handleFullNameChange = (e) => {
    const inputFullNmae = e.target.value;
    const limitedFullName = inputFullNmae.substring(0, MAX_FULLNAME_LENGTH); 
    setFullName(limitedFullName);
  };
  const remainingFullNameCharacters = MAX_FULLNAME_LENGTH - fullName.length;

  // BIO limitation
  const MAX_BIO_LENGTH = 200;
  const handleBioChange = (e) => {
    const inputBio = e.target.value;
    const limitedBio = inputBio.substring(0, MAX_BIO_LENGTH); 
    setBio(limitedBio);
  };
  const remainingCharacters = MAX_BIO_LENGTH - bio.length;
  
// LOCATION limitation
const MAX_LOCATION_LENGTH = 25;
const handleLocationChange = (e) => {
  const inputLocation = e.target.value;
  const limitedLocation = inputLocation.substring(0, MAX_LOCATION_LENGTH); 
  setLocation(limitedLocation);
};
const remainingLocationCharacters = MAX_LOCATION_LENGTH - location.length;

// WEBSITE limitation
const MAX_WEBSITE_LENGTH = 60;
const handleWebsiteChange = (e) => {
  const inputWebsite = e.target.value;
  const limitedWebsite = inputWebsite.substring(0, MAX_WEBSITE_LENGTH ); 
  setWebsite(limitedWebsite);
};
const remainingWebsiteCharacters = MAX_WEBSITE_LENGTH  - website.length;


  const handleUpdateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const storageRef = ref(storage, `userPictureURL/${user.uid}`)
    const storageRef2 = ref(storage, `userBannerURL/${user.uid}`)
    let URL = ''
    let BannerURL = ''
    try {
      if (selectedImage) {
         await uploadString(storageRef, selectedImage, "data_url")
         URL = await getDownloadURL(ref(storage, `userPictureURL/${user.uid}`))     
      } if(selectedBanner){
        await uploadString(storageRef2, selectedBanner, "data_url")
        BannerURL = await getDownloadURL(ref(storage, `userBannerURL/${user.uid}`))    
      }
      const userRef = doc(db, "users", user.uid);
      const newData = {
        fullName: fullName || currentUser.fullName,
        bio: bio || currentUser.bio,
        location: location || currentUser.location,
        website: website || currentUser.website,
        userPictureURL: URL || currentUser.userPictureURL,
        userBannerURL: BannerURL || currentUser.userBannerURL
      };
  
      await updateDoc(userRef, newData);
      window.location.reload();
      window.location.href = `/${currentUser.userName}`;
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
      setSuccess(false)
    }
  };
  
  return (
  <main className='flex flex-col w-full h-screen items-center justify-center bg-black'>
    {currentUser? 
      <div className="flex flex-col w-full sm:max-w-[600px] h-full">
       <div className='flex p-3 items-center fixed h-12 w-full max-w-[600px]'>
         <Link className='hover:bg-[#363535] rounded-full p-2' to={`/${currentUser.userName}`} ><IoMdArrowRoundBack className='text-[25px] cursor-pointer'/></Link>
         </div>
          <div className='flex flex-col w-full h-full justify-center items-center overflow-scroll pt-1 mt-[48px]'>
           <div className="w-full flex flex-col ">
            
             {/* BANNER IMAGE starts here */}
              <div className="w-full relative h-[200px] overflow-hidden outline-none mt-20">
              { currentUser.userBannerURL || selectedBanner ?
                <img 
                  className="w-full h-full bg-[#958c8c] object-cover aspect-square max-h-[200px]" 
                  src={selectedBanner || currentUser.userBannerURL} 
                  alt="" 
                />
              :""
              }  
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex bg-black p-2 rounded-full bg-opacity-70">
                    <TbCameraPlus onClick={() => bannerFileRef.current.click()} className="cursor-pointer text-white text-xl" />
                    <input 
                      type="file" 
                      hidden 
                      ref={bannerFileRef} 
                      onChange={(e) => {
                        const file = e.target.files[0]; 
                        const reader = new FileReader();
                        reader.onload = function(event) {
                          setSelectedBanner(event.target.result);
                        }
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* PROFILE IMAGE starts here */}
              <div className='flex mt-[-63px] w-32 h-32 ml-2 rounded-full bg-gray-500 relative'>
               <img className='rounded-full object-cover aspect-square border-2 border-white' src={ selectedImage || currentUser.userPictureURL } alt="" />
                <div className='absolute inset-0 flex items-center justify-center'>
                 <div className='flex bg-black p-2 rounded-full bg-opacity-70'>
                  <TbCameraPlus onClick={() => fileRef.current.click()} className='cursor-pointer text-white text-xl'/>
                  <input type="file" 
                           hidden ref={fileRef} 
                           onChange={(e) => {
                           const file = e.target.files[0]; 
                           const reader = new FileReader();
                           reader.onload = function(event) {
                           setSelectedImage(event.target.result);
                           }
                           reader.readAsDataURL(file);
                      }}
                  />
                 </div>
                 </div>
                </div>
               <form className='p-2 flex w-full flex-col mb-10' onSubmit={handleUpdateData}>
                  <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                    Full Name <span className="text-gray-500 text-sm">{remainingFullNameCharacters}/{MAX_FULLNAME_LENGTH}</span>
                  </label>
                  <input
                    className="shadow bg-transparent border borderBg rounded w-full py-2 px-3 leading-tight outline-none "
                    id="full-name"
                    type="text"
                    placeholder={currentUser.fullName}
                    value={fullName}
                    onChange={handleFullNameChange}
                  />
             </div>
             <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                Bio <span className="text-gray-500 text-sm">{remainingCharacters}/{MAX_BIO_LENGTH}</span>
              </label>
              <textarea
                className="shadow bg-transparent border borderBg rounded w-full py-2 h-[100px] px-3 leading-tight outline-none"
                id="bio"
                placeholder={currentUser.bio}
                value={bio}
                onChange={handleBioChange}
              />
            </div>
             <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                   Location <span className="text-gray-500 text-sm">{remainingLocationCharacters}/{MAX_LOCATION_LENGTH}</span>
                  </label>
                  <input
                  className="shadow bg-transparent border borderBg rounded w-full py-2 px-3 leading-tight outline-none"
                  id="location"
                  type="text"
                  placeholder={currentUser.location}
                  value={location}
                  onChange={handleLocationChange}
                  />
             </div>
             <div className="mb-4">
                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                     Website <span className="text-gray-500 text-sm">{remainingWebsiteCharacters}/{MAX_WEBSITE_LENGTH}</span>
                  </label>
                  <input
                  className="shadow bg-transparent border borderBg rounded w-full  py-2 px-3 leading-tight outline-none"
                  id="website"
                  type="text"
                  placeholder={currentUser.website}
                  value={website}
                  onChange={handleWebsiteChange}
                  />
             </div>
             <div className="flex items-center justify-between">
             <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:s
              hadow-outline"
              type="submit"
              >
              {loading ? 'Updating...' : 'Update Profile'}
              </button>
             </div>
             </form>
           </div>
          </div>
         </div>
        :  (
         <p>Loading...</p>
     )}
  </main>
  );
};

export default UpdateProfile;




