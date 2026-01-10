import { auth, googleProvider } from '../firebase.js';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { state } from '../state.js';

let isLoginMode = false;

// --- Modal Controls ---
export function openSignupModal() {
  document.getElementById('signup-modal').classList.remove('hidden');
  isLoginMode = false;
  updateAuthModalUI();
}

export function closeSignupModal() {
  document.getElementById('signup-modal').classList.add('hidden');
  document.getElementById('signup-form').reset();
}

export function closeSignupModalOnBackdrop(event) {
  if (event.target.id === 'signup-modal') closeSignupModal();
}

export function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  updateAuthModalUI();
}

function updateAuthModalUI() {
  const title = document.querySelector('#signup-modal h3');
  const btn = document.getElementById('signup-btn');
  const toggleText = document.getElementById('auth-toggle-text');
  const nameField = document.getElementById('signup-name').parentElement;

  if (isLoginMode) {
    title.textContent = 'Log In';
    btn.textContent = 'Log In';
    nameField.style.display = 'none';
    document.getElementById('signup-name').required = false;
    toggleText.innerHTML = 'Need an account? <a href="#" onclick="toggleAuthMode()" class="text-blue-600 hover:underline">Sign Up</a>';
  } else {
    title.textContent = 'Sign Up';
    btn.textContent = 'Sign Up';
    nameField.style.display = 'block';
    document.getElementById('signup-name').required = true;
    toggleText.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()" class="text-blue-600 hover:underline">Log In</a>';
  }
}

// --- Firebase Auth Logic ---

export async function handleGoogleLogin() {
  try {
    await signInWithPopup(auth, googleProvider);
    closeSignupModal();
  } catch (error) {
    console.error("Google Login Error:", error);
    alert(error.message);
  }
}

export async function handleSignup(event) {
  event.preventDefault();
  
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  try {
    if (isLoginMode) {
       await signInWithEmailAndPassword(auth, email, password);
       // Alert optional, usually auto-close is better
    } else {
       const name = document.getElementById('signup-name').value;
       const result = await createUserWithEmailAndPassword(auth, email, password);
       await updateProfile(result.user, { displayName: name });
    }
    closeSignupModal();
  } catch (error) {
    console.error("Auth Error:", error);
    alert(error.message);
  }
}

export async function handleLogout() {
  try { await signOut(auth); } catch (error) { console.error(error); }
}
