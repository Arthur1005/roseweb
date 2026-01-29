const addBtn = document.getElementById('add-project-btn');
const modal = document.getElementById('project-modal');

// When owner clicks '+', show the form
addBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});



import { db } from './firebase-config.js'; // Ensure you exported 'db' in your config file
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const saveBtn = document.getElementById('save-project');

saveBtn.addEventListener('click', async () => {
    const title = document.getElementById('proj-title').value;
    const desc = document.getElementById('proj-desc').value;

    try {
        await addDoc(collection(db, "projects"), {
            title: title,
            description: desc,
            createdAt: new Date()
        });
        alert("Project Added!");
        modal.style.display = 'none'; // Hide form after saving
    } catch (error) {
        console.error("Error: ", error);
    }
});




import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();
const loginBtn = document.getElementById('auth-btn');

// 1. Handle Login Attempt
loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        document.getElementById('login-modal').style.display = 'none';
        alert("Welcome back, Owner.");
    } catch (error) {
        alert("Access Denied: " + error.message);
    }
});

// 2. The "Security Guard" (Listens for login status)
onAuthStateChanged(auth, (user) => {
    const adminElements = document.querySelectorAll('.owner-only');
    
    if (user) {
        // Show all buttons with the 'owner-only' class
        adminElements.forEach(el => el.style.display = 'block');
        console.log("Logged in as:", user.email);
    } else {
        // Keep them hidden for everyone else
        adminElements.forEach(el => el.style.display = 'none');
    }
});