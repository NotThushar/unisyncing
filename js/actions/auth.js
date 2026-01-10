import { auth, googleProvider } from '../firebase.js';
import { signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { setState } from '../state.js';
import { renderApp } from '../ui/appShell.js';

export async function handleGoogleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Update global state
    setState('currentUser', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    });

    console.log("Logged in as:", user.displayName);
    
    // Close modal and re-render
    if(window.closeSignupModal) window.closeSignupModal();
    renderApp();

  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert("Login failed: " + error.message);
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

export function handleSignup(e) {
    // Legacy email/password signup (keep if needed, otherwise rely on Google)
    e.preventDefault();
    alert("Please use the 'Sign in with Google' button above.");
}
