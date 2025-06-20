import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAj-TUJAkll5q1Wg7DwAJAwTliIxpbeJUA",
  authDomain: "cozinha-da-vivi-18c22.firebaseapp.com",
  databaseURL: "https://cozinha-da-vivi-18c22-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cozinha-da-vivi-18c22",
  storageBucket: "cozinha-da-vivi-18c22.firebasestorage.app",
  messagingSenderId: "441913117573",
  appId: "1:441913117573:web:a493f3b3df9eb198f552ec"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Exporte TUDO que será usado nos componentes
export { 
  database, 
  auth, 
  ref, 
  push, 
  set, 
  onValue,
  getAuth,
  signInAnonymously 
};