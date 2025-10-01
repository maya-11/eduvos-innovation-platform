import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLewdLtM5UE3ArPAQBM-VerRsvLoh2SAM",
  authDomain: "eduvos-innovation.firebaseapp.com",
  projectId: "eduvos-innovation",
  storageBucket: "eduvos-innovation.firebasestorage.app",
  messagingSenderId: "632163544683",
  appId: "1:632163544683:web:f448006828272c71ba0b2e"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
