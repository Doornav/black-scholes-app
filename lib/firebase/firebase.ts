import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCGP000GrCmFJv5f8d6e0l94KCgsKfbdVA",
    authDomain: "black-scholes-app.firebaseapp.com",
    projectId: "black-scholes-app",
    storageBucket: "black-scholes-app.firebasestorage.app",
    messagingSenderId: "302856153072",
    appId: "1:302856153072:web:0c72668047bef7788b1f35",
    measurementId: "G-BYL5G897QS"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 