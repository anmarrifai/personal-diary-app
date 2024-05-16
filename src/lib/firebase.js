import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBz1m9vfW9nVZr2BIf9vLM2UZH-GMKBsVA",
    authDomain: "personaldiary-5ba04.firebaseapp.com",
    projectId: "personaldiary-5ba04",
    storageBucket: "personaldiary-5ba04.appspot.com",
    messagingSenderId: "1002934890798",
    appId: "1:1002934890798:web:8d2d2f59f275b16d9acabf"
  };
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig)
} else {
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig)
}

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)