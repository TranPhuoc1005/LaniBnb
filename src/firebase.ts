import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAM2OcuuZZnea6V_QO8T_DgEP1L34ZY8Ug",
  authDomain: "lanibnb.firebaseapp.com",
  projectId: "lanibnb",
  storageBucket: "lanibnb.firebasestorage.app",
  messagingSenderId: "139700157478",
  appId: "1:139700157478:web:6292d8a70ea33cb80b7ae7",
  measurementId: "G-69Y12VJSXP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);