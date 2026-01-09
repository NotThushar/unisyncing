import { state } from './state.js';
import { sampleEvents } from './data/sampleEvents.js';

const STORAGE_KEY = 'unisync_events';

export function loadData() {
  try {
    // Attempt to load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      state.allEvents = JSON.parse(stored);
    } else {
      // Fallback if empty
      state.allEvents = [...sampleEvents];
      // Try to save initial set, but ignore errors if we can't write
      try { saveData(); } catch (e) { console.warn('Initial save unavailable'); }
    }
  } catch (err) {
    // Fallback if localStorage access is blocked/fails
    console.warn('Storage access failed, using in-memory mode:', err);
    state.allEvents = [...sampleEvents];
  }
}

export function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.allEvents));
  } catch (err) {
    console.warn('Save failed (storage might be blocked):', err);
  }
}