import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyCdhvAw15VRXvC0-vx_7gYLTsU1qC-IDCE",
  authDomain: "social-media-657d9.firebaseapp.com",
  projectId: "social-media-657d9",
  storageBucket: "social-media-657d9.appspot.com",
  messagingSenderId: "763126170178",
  appId: "1:763126170178:web:de0fea9e802880ec6a63db",
  measurementId: "G-41XJ435FGD"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)