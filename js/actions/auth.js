import { auth, googleProvider } from '../firebase.js';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { setState } from '../state.js';
import { renderApp } from '../ui/appShell.js';

export async function handleGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    setState('currentUser', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    });

    console.log("Logged in as:", user.displayName);
    if(window.closeSignupModal) window.closeSignupModal();
    renderApp();

  } catch (error) {
    console.error("Google Sign-In Error:", error);
    // Handle the specific error where account exists with different credential
    if (error.code === 'auth/account-exists-with-different-credential') {
        alert("An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.");
    } else {
        alert("Login failed: " + error.message);
    }
  }
}

export async function handleLogout() {
    try {
        await signOut(auth);
        setState('currentUser', null);
        renderApp();
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

export async function handleSignup(e) {
    e.preventDefault();
    
    // Check if this is a login or signup attempt based on context or button
    // For simplicity in this modal, we might want to try Login first, if fail then Signup, 
    // OR just use Google which is safer.
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value;

    try {
        // Try creating user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Success
        alert("Account created! Welcome " + name);
        if(window.closeSignupModal) window.closeSignupModal();
        
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            // If email exists, try logging in instead automatically
            try {
                const loginCredential = await signInWithEmailAndPassword(auth, email, password);
                if(window.closeSignupModal) window.closeSignupModal();
                alert("Welcome back!");
            } catch (loginError) {
                alert("Account exists. Please check your password or use Google Sign In.");
            }
        } else {
            alert("Error: " + error.message);
        }
    }
}
