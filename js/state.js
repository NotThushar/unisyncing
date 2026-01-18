export const state = {
  allEvents: [],
  currentUser: null, 
  currentTab: 'discover',
  selectedCategory: 'all',
  selectedOrganization: 'all',
  darkMode: false,
  
  // Auth tokens
  googleAccessToken: null,
  
  // Transient UI state
  eventQuestions: [],
  currentEditingEventId: null,
  selectedEventForDetails: null,
  currentRegistrationEventId: null
};

export function setState(key, value) {
  state[key] = value;
}