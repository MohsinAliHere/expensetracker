import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyB5RdlvXTu3ICyNeUKwcvd5ezkdbzB83dE",
  authDomain: "expensetracker2k24.firebaseapp.com",
  projectId: "expensetracker2k24",
  storageBucket: "expensetracker2k24.appspot.com",
  messagingSenderId: "984944288996",
  appId: "1:984944288996:web:fdf2e818be15472482f8f1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,db };
