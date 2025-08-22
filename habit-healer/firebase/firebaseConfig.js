import { initializeApp } from 'firebase/app';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { 
  sendPasswordResetEmail,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser
} from 'firebase/auth';
import { getDatabase, ref, child, get, set, push, remove } from 'firebase/database';

const firebaseConfig = { 
  apiKey: "AIzaSyCAQbwB4R3GrrRiRg_ySAicqFY1f4oR4xk",
  authDomain: "habit-healer.firebaseapp.com",
  databaseURL: "https://habit-healer-default-rtdb.firebaseio.com",
  projectId: "habit-healer",
  storageBucket: "habit-healer.appspot.com",
  messagingSenderId: "741995854799",
  appId: "1:741995854799:web:11f2c07984e230a9d3b0ba",
  measurementId: "G-XLWRY0PRCT"
 };

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export {
  app,
  sendPasswordResetEmail,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  getDatabase,
  ref,
  child,
  get,
  set,
  push,
  remove
};