import { state } from '../state.js';
import { saveData } from '../storage.js';
import { renderApp } from '../ui/appShell.js';
import { renderQuestionsList, showSimpleMessage } from '../ui/modals.js';

// Event Registration
export function registerForEvent(eventId) {
  const event = state.allEvents.find(e => e.id === eventId);
  if (!event) return;

  event.isSubscribed = true;
  const registrations = event.registrations ? JSON.parse(event.registrations) : {};
  registrations['currentUser'] = {
    userId: 'currentUser',
    registeredAt: new Date().toISOString()
  };
  event.registrations = JSON.stringify(registrations);

  saveData();
  renderApp();
}

export function confirmCancelRegistration(eventId) {
  const event = state.allEvents.find(e => e.id === eventId);
  if (!event) return;

  event.isSubscribed = false;
  const registrations = event.registrations ? JSON.parse(event.registrations) : {};
  delete registrations['currentUser'];
  event.registrations = JSON.stringify(registrations);

  saveData();
  renderApp();
}

export function openDiscoverEventDetails(eventId) {
  showSimpleMessage('Click Register to sign up for this event!');
}

export function openEventDetails(eventId) {
  showSimpleMessage('You are registered for this event!');
}

// Creation Modal
export function openCreateModal() {
  state.eventQuestions = [];
  document.getElementById('create-modal').classList.remove('hidden');
}

export function closeCreateModal() {
  document.getElementById('create-modal').classList.add('hidden');
  document.getElementById('event-form').reset();
  state.eventQuestions = [];
}

export function closeModalOnBackdrop(event) {
  if (event.target.id === 'create-modal') {
    closeCreateModal();
  }
}

export function handleCreateEvent(event) {
  event.preventDefault();

  const isClub = state.currentTab === 'organizations';
  const newEvent = {
    id: Date.now().toString(),
    title: document.getElementById('title').value,
    organization: isClub ? document.getElementById('title').value : document.getElementById('organization').value,
    category: document.getElementById('category').value,
    date: isClub ? '' : document.getElementById('date').value,
    time: isClub ? '' : document.getElementById('time').value,
    location: document.getElementById('location').value,
    description: document.getElementById('description').value,
    questions: JSON.stringify(state.eventQuestions),
    registrations: JSON.stringify({}),
    isSubscribed: false,
    isClub: isClub,
    clubMembers: isClub ? JSON.stringify([]) : '',
    clubMembersOnly: isClub ? false : (document.getElementById('club-members-only')?.checked || false),
    createdAt: new Date().toISOString()
  };

  state.allEvents.push(newEvent);
  saveData();
  closeCreateModal();
  
  if (isClub) {
    switchTab('organizations'); // Assumes global availability, handled in app.js
  } else {
    renderApp();
  }
}

// Question Management
export function openQuestionsModal() {
  document.getElementById('questions-modal').classList.remove('hidden');
  renderQuestionsList();
}

export function closeQuestionsModal() {
  document.getElementById('questions-modal').classList.add('hidden');
}

export function closeQuestionsModalOnBackdrop(event) {
  if (event.target.id === 'questions-modal') {
    closeQuestionsModal();
  }
}

export function saveQuestions() {
  closeQuestionsModal();
}

export function addQuestion() {
  const newQuestion = {
    id: Date.now().toString(),
    question: '',
    required: false,
    yesNoType: false
  };
  state.eventQuestions.push(newQuestion);
  renderQuestionsList();
}

export function removeQuestion(questionId) {
  state.eventQuestions = state.eventQuestions.filter(q => q.id !== questionId);
  renderQuestionsList();
}

export function updateQuestion(questionId, field, value) {
  const question = state.eventQuestions.find(q => q.id === questionId);
  if (question) {
    question[field] = value;
  }
}