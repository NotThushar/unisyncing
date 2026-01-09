export const state = {
  allEvents: [],
  currentTab: 'discover',
  selectedCategory: 'all',
  selectedOrganization: 'all',
  darkMode: false,
  
  // Transient UI state
  eventQuestions: [],
  currentEditingEventId: null,
  selectedEventForDetails: null
};

export function setState(key, value) {
  state[key] = value;
}