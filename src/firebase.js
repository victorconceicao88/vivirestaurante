import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, off } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCV809Fi4JTLZclARfU4MtNSAVkJIrGcfk",
  authDomain: "cozinha-da-vivi-83d09.firebaseapp.com",
  databaseURL: "https://cozinha-da-vivi-83d09-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cozinha-da-vivi-83d09",
  storageBucket: "cozinha-da-vivi-83d09.firebasestorage.app",
  messagingSenderId: "740046409209",
  appId: "1:740046409209:web:f8cff12dc530e22fba4128"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth, ref, push, set, onValue, off };