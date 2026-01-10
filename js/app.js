import { loadData } from './storage.js';
import { renderApp } from './ui/appShell.js';
import { renderModals } from './ui/modals.js';
import { state, setState } from './state.js';
import { handleCreateEvent, addQuestion, removeQuestion, updateQuestion } from './actions/events.js';
import { handleClubApplication } from './actions/clubs.js';
import { handleSignup, handleGoogleLogin } from './actions/auth.js';

// --- State Management for Questions Modal ---
let eventQuestions = [];

// --- Global Functions (Attached to Window for HTML onclick attributes) ---
Object.assign(window, {
  
  // Navigation
  switchTab: (tab) => {
    setState('currentTab', tab);
    renderApp();
  },
  
  filterByCategory: (category) => {
    setState('selectedCategory', category);
    renderApp();
  },

  filterByOrganization: (val) => {
    setState('selectedOrganization', val.toLowerCase());
    renderApp();
    setTimeout(() => {
        const el = document.getElementById('org-search');
        if(el) {
            el.focus();
            el.value = val; 
        }
    }, 0);
  },

  toggleDarkMode: () => {
    setState('darkMode', !state.darkMode);
    renderApp();
  },

  // Modal Controls
  openSignupModal: () => document.getElementById('signup-modal').classList.remove('hidden'),
  closeSignupModal: () => document.getElementById('signup-modal').classList.add('hidden'),
  closeSignupModalOnBackdrop: (e) => { if(e.target.id === 'signup-modal') window.closeSignupModal() },

  openCreateModal: () => {
     eventQuestions = []; // Reset questions
     document.getElementById('create-modal').classList.remove('hidden');
  },
  closeCreateModal: () => document.getElementById('create-modal').classList.add('hidden'),
  closeModalOnBackdrop: (e) => { if(e.target.id === 'create-modal') window.closeCreateModal() },

  // Questions Logic
  openQuestionsModal: () => {
      document.getElementById('questions-modal').classList.remove('hidden');
      renderQuestionsList();
  },
  closeQuestionsModal: () => document.getElementById('questions-modal').classList.add('hidden'),
  closeQuestionsModalOnBackdrop: (e) => { if(e.target.id === 'questions-modal') window.closeQuestionsModal() },
  
  addQuestion: () => {
      eventQuestions.push({ id: Date.now(), text: '', type: 'text' });
      renderQuestionsList();
  },
  removeQuestion: (id) => {
      eventQuestions = eventQuestions.filter(q => q.id !== id);
      renderQuestionsList();
  },
  updateQuestion: (id, text) => {
      const q = eventQuestions.find(q => q.id === id);
      if(q) q.text = text;
  },
  saveQuestions: () => {
      // Questions are saved in the global variable 'eventQuestions' which handleCreateEvent will read
      window.closeQuestionsModal();
  },
  
  // Registration
  closeRegistrationModal: () => document.getElementById('registration-modal').classList.add('hidden'),
  closeRegistrationModalOnBackdrop: (e) => { if(e.target.id === 'registration-modal') window.closeRegistrationModal() },
  
  // Details
  closeEventDetailsModal: () => document.getElementById('event-details-modal').classList.add('hidden'),
  closeEventDetailsModalOnBackdrop: (e) => { if(e.target.id === 'event-details-modal') window.closeEventDetailsModal() },

  // Clubs
  openClubApplicationModal: () => document.getElementById('club-application-modal').classList.remove('hidden'),
  closeClubApplicationModal: () => document.getElementById('club-application-modal').classList.add('hidden'),
  closeClubApplicationModalOnBackdrop: (e) => { if(e.target.id === 'club-application-modal') window.closeClubApplicationModal() },

  // Action Handlers
  handleSignup,
  handleGoogleLogin,
  handleCreateEvent: (e) => handleCreateEvent(e, eventQuestions), // Pass questions to event creator
  handleClubApplication
});

function renderQuestionsList() {
    const list = document.getElementById('questions-list');
    if(!list) return;
    
    list.innerHTML = eventQuestions.map((q, idx) => `
        <div class="flex items-center gap-2 bg-gray-50 p-3 rounded border">
            <span class="font-bold text-gray-500">Q${idx+1}</span>
            <input type="text" value="${q.text}" onchange="updateQuestion(${q.id}, this.value)" class="flex-1 bg-transparent border-none outline-none" placeholder="Enter question...">
            <button type="button" onclick="removeQuestion(${q.id})" class="text-red-500 font-bold px-2">×</button>
        </div>
    `).join('');
}

// Initialize
(async function init() {
    const app = document.getElementById('app');
    if(app) app.innerHTML = `<div class="flex items-center justify-center h-screen">Loading...</div>`;
    
    // Load Data & Render
    await loadData(); // This should set up the Firebase listener
    renderApp();
})();
