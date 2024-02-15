import { useUserData } from '../../getUserData';
import { useParams } from "react-router-dom";
import { auth, db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const FollowFunction = () => {
  const { userProfile, allUsersData } = useUserData();
  const { username } = useParams();
  const currentUser = allUsersData?.find(user => user.userName === username);
  const [user] = useAuthState(auth);

  const handleFollowAction = async (e) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", user.uid);
      const userRef2 = doc(db, "users", currentUser.uid);

      if (userProfile[0]?.following.includes(currentUser?.uid)) {
        const index = userProfile[0].following.indexOf(currentUser?.uid);
        userProfile[0].following.splice(index, 1);
      } else {
        userProfile[0].following.push(currentUser?.uid);
      }

      if (currentUser?.followers.includes(userProfile[0]?.uid)) {
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

  return { handleFollowAction };
};

export default FollowFunction;
