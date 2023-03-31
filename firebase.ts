// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyBH3xJdFkKCD9zMHGKgw2q2ERdh0ygZxj4",
    authDomain: "wor-project.firebaseapp.com",
    databaseURL: "https://wor-project-default-rtdb.firebaseio.com",
    projectId: "wor-project",
    storageBucket: "wor-project.appspot.com",
    messagingSenderId: "1026162383658",
    appId: "1:1026162383658:web:f52d5b7812c73d01665c53",
    measurementId: "G-CPVC2907R4"
  };

export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)


export const db=getFirestore(app)
export const storage=getStorage(app)
export const database=getDatabase(app)
