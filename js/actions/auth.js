import { showSimpleMessage } from '../ui/modals.js';

export function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signup-name').value;
  showSimpleMessage(`Welcome, ${name}! Your account has been created successfully.`);
  document.getElementById('signup-modal').classList.add('hidden');
  document.getElementById('signup-form').reset();
}

export function openSignupModal() {
  document.getElementById('signup-modal').classList.remove('hidden');
}

export function closeSignupModal() {
  document.getElementById('signup-modal').classList.add('hidden');
  document.getElementById('signup-form').reset();
}

export function closeSignupModalOnBackdrop(event) {
  if (event.target.id === 'signup-modal') {
    closeSignupModal();
  }
}