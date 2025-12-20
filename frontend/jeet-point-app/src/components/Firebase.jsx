// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa4rVrbCGCJPtwzaldLgT8ReDGxfrY3pY",
  authDomain: "jeet-point.firebaseapp.com",
  projectId: "jeet-point",
  storageBucket: "jeet-point.firebasestorage.app",
  messagingSenderId: "63011586055",
  appId: "1:63011586055:web:b8fe5703f855d5ce516aa2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();

const db=getFirestore(app);

export {auth,provider,db};