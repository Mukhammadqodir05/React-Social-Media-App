import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
import { db, auth } from "./firebase";
import { query, where, getDocs, collection, onSnapshot } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';


const UserDataContext = createContext();

const GetUserData = ({ children }) => {
  const [allUsersData, setAllUsersData] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [user, loading] = useAuthState(auth);
  

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      let allUsersData = [];
      snapshot.docChanges().forEach((change) => {
        const { id } = change.doc;
        const data = change.doc.data();
        if (change.type === "added") {
          allUsersData.push({ id, ...data });
        } else if (change.type === "modified") {
          // Handle modified data if needed
        } else if (change.type === "removed") {
          // Handle removed data if needed
        }
      });
      setAllUsersData(allUsersData);
    });
  
    return () => unsubscribe();
  }, []);
  



  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!loading && user) {
        setIsLoading(true);
        const uid = user.uid;
        const q = query(collection(db, "users"), where("uid", "==", uid));
        try {
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            setUserProfile(null);
          } else {
            let userProfileData = [];
            querySnapshot.forEach((doc) => {
              userProfileData.push({ id: doc.id, ...doc.data() });
            });
            setUserProfile(userProfileData); 
          }
        } catch (error) {
          console.error("Error fetching user profile: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user, loading]);

  
 


  return (
    <UserDataContext.Provider value={{ userProfile, allUsersData, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};

const useUserData = () => useContext(UserDataContext);
export { GetUserData, useUserData };

