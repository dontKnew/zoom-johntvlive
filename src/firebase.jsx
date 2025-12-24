// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAf3gGwrAST5lyeLeojMMSJrohGRA-KZ3c",
  authDomain: "johntvlive-670be.firebaseapp.com",
  databaseURL: "https://johntvlive-670be-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "johntvlive-670be",
  storageBucket: "johntvlive-670be.firebasestorage.app",
  messagingSenderId: "450247359259",
  appId: "1:450247359259:web:295799f162fcea4da9f1be",
  measurementId: "G-SDG12RVR05"
};

const app = initializeApp(firebaseConfig);

// Get Firebase Authentication instance
export const auth = getAuth(app);
export const db = getDatabase(app);
const { forceWebSockets } = await import("@firebase/database");
forceWebSockets();

