// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoDQH7J0dLDynnXn8Lsf2KXh6IPTUUC6w",
  authDomain: "lacabine-6ebca.firebaseapp.com",
  projectId: "lacabine-6ebca",
  storageBucket: "lacabine-6ebca.firebasestorage.app",
  messagingSenderId: "1000100408077",
  appId: "1:1000100408077:web:a72766c4d0e1d8f4e45e44",
  measurementId: "G-K25JBH8C84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy
};