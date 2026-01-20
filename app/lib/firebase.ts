// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth"; // for authentication
import { getFirestore } from "firebase/firestore"; // for firestore database
import { getStorage } from "firebase/storage"; // for firebase storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAibRzTxN66RkMGWPBWtPcPvByQSRfMV_4",
  authDomain: "roadhelper-947d3.firebaseapp.com",
  projectId: "roadhelper-947d3",
  storageBucket: "roadhelper-947d3.firebasestorage.app",
  messagingSenderId: "216764003910",
  appId: "1:216764003910:web:d9699b53a0dbedea04bc47",
  measurementId: "G-4ZP9TM95VF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Authentication
const auth = getAuth(app);

// Database
const db = getFirestore(app);

export { app, auth, db };
