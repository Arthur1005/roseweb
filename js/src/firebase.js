// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyDqex8fvOHREyavy0BsTUqge-Lccu66dM8",
authDomain: "roselam-47ab1.firebaseapp.com",
projectId: "roselam-47ab1",
storageBucket: "roselam-47ab1.firebasestorage.app",
messagingSenderId: "1072333228569",
appId: "1:1072333228569:web:995d54b896f21e1ad23888",
measurementId: "G-7PGL8W8BWF"
};

// Initialize once and export for style.js to use
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);