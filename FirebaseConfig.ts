// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence} from 'firebase/auth'
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCybiMBIWnUifAQ9w9aSD2cyPY4OO7CZ_I",
  authDomain: "rpglife-8273f.firebaseapp.com",
  projectId: "rpglife-8273f",
  storageBucket: "rpglife-8273f.firebasestorage.app",
  messagingSenderId: "671236475281",
  appId: "1:671236475281:web:adba7382771f73d9a73230",
  measurementId: "G-XMJZ66KT4P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// export const analytics = getAnalytics(app);
export const db = getFirestore(app);