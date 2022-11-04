import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onDisconnect, onChildAdded, onChildRemoved, onValue } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAxNEZhozT6ZozBdtAPE7fZy1cJelIACdw",
    authDomain: "maze-multiplayer-game.firebaseapp.com",
    databaseURL: "https://maze-multiplayer-game-default-rtdb.firebaseio.com",
    projectId: "maze-multiplayer-game",
    storageBucket: "maze-multiplayer-game.appspot.com",
    messagingSenderId: "871920521008",
    appId: "1:871920521008:web:93c7ebe75e6774e0e502f5"
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

