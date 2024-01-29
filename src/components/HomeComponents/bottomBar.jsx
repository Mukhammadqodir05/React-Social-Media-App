import React,{useState,useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlusSquare, FaCompass, FaUser, FaBell } from 'react-icons/fa';
import {AiFillHome} from "react-icons/ai";
import LogOut from '../../Auth/logout'
import { useParams } from 'react-router-dom';
import { db, auth } from "../../firebase";
import { query, where, getDocs, collection } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';


const BottomBar = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, loading] = useAuthState(auth); 
  const [userName, setUserName] = useState(""); 
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
      setUserName(data[0].userName);
    }
  }, [data]);

         
return (
     <main className="fixed BottomBar bottom-0 left-0 w-full border-t flex justify-around  p-3 text-white bg-[#3a1450] borderBg">
       
       <NavLink to="/" className='rounded-md' activeclassname="active">
            <li className="flex gap-5 p-2">
              <AiFillHome size={30} className="cursor-pointer" />
            </li>
          </NavLink>
          <NavLink to="/explore" className='rounded-md' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaCompass size={27} className="cursor-pointer"/>
            </li>
          </NavLink>
          <NavLink to="/post" className='rounded-md' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaPlusSquare size={27} className="cursor-pointer"/>
            </li>
          </NavLink>
          <NavLink to="/notifications" className='rounded-md' activeclassname='active'>
            <li className="flex gap-5 p-2">
              <FaBell size={27} className="cursor-pointer"/>
            </li>
          </NavLink>
          <NavLink to={`/profile/${userName}`} className='rounded-md' activeclassname='active'>
          <li className="flex gap-5 p-2">
            <FaUser size={27} className="cursor-pointer"/>
          </li>
        </NavLink>
          <li className="flex gap-5 p-2">
            <LogOut/>
          </li>
    </main>
   );
};   

export default BottomBar