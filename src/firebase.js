import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJ_nhoZDLq1tqV8u9pD7pkOPqiZTSDEMw",
  authDomain: "recycle-specs.firebaseapp.com",
  projectId: "recycle-specs",
  storageBucket: "recycle-specs.firebasestorage.app",
  messagingSenderId: "647936090320",
  appId: "1:647936090320:web:7594affbd5e1b322ce7ed5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
