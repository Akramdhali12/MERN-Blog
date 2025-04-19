// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-7cf4f.firebaseapp.com",
  projectId: "mern-blog-7cf4f",
  storageBucket: "mern-blog-7cf4f.firebasestorage.app",
  messagingSenderId: "43925165387",
  appId: "1:43925165387:web:2ea739b62a1ba91a9dc4ce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
