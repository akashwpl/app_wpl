import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID, // Replaced with ENV
  storageBucket: import.meta.env.VITE_STORAGEBUCKET, // Replaced with ENV
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID, // Replaced with ENV
  appId: import.meta.env.VITE_APPID, // Replaced with ENV
  measurementId: import.meta.env.VITE_MEASUREMENTID // Replaced with ENV
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };