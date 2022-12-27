import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onDisconnect, onChildAdded, onChildRemoved, onValue, serverTimestamp } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIkEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_ID
    
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getDatabase(app);
export const _ref = ref;
export const _set = set;
export const auth = getAuth();
export const _signInAnonymously = signInAnonymously;
export const _onAuthStateChanged = onAuthStateChanged;
export const _onDisconnect = onDisconnect;
export const _onChildAdded = onChildAdded;
export const _onChildRemoved = onChildRemoved;
export const _onValue = onValue;
export const _serverTimestamp = serverTimestamp();

