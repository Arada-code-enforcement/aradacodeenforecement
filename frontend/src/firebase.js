import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOyMzKcMk7hyfPFKI82hikbKtF62TqC0U",
  authDomain: "codeenforcement-72331.firebaseapp.com",
  projectId: "codeenforcement-72331",
  storageBucket: "codeenforcement-72331.firebasestorage.app",
  messagingSenderId: "1045994683760",
  appId: "1:1045994683760:web:dec0d70de529677fc9e3b5",
  measurementId: "G-F6Z1XSXPDC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
