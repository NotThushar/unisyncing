import { state } from '../state.js';
import { saveData } from '../storage.js';
import { renderApp } from '../ui/appShell.js';
import { openRegistrationModal } from './events.js'; // Reuse the registration modal logic

export function joinClub(clubName) {
  let club = state.allEvents.find(e => e.isClub && e.title === clubName);
  
  // Default questions for a club application if they don't exist
  const applicationQuestions = [
    { id: 'fullname', question: 'Full Name', required: true, yesNoType: false },
    { id: 'studentId', question: 'Student ID', required: true, yesNoType: false },
    { id: 'reason', question: 'Why do you want to join?', required: true, yesNoType: false }
  ];

  if (!club) {
    // If club doesn't exist in our DB yet (from preset list), create a temporary object for context
    // In a real app, you wouldn't create it here, but for this mock setup:
    let category = 'Social';
    if (clubName.includes('Computer') || clubName.includes('IEEE')) category = 'Academic';
    if (clubName.includes('Sports')) category = 'Sports';
    
    // We don't save this yet, just use it to open the modal
    club = {
        id: 'temp-' + Date.now(),
        title: clubName,
        isClub: true,
        questions: JSON.stringify(applicationQuestions)
    };
    // We push it to state temporarily so the modal can find it by ID
    state.allEvents.push(club);
  } else {
    // Ensure existing clubs have the questions if they try to join
    if (!club.questions || club.questions === '[]') {
      club.questions = JSON.stringify(applicationQuestions);
    }
  }

  // Open the modal to ask questions instead of immediate join
  openRegistrationModal(club.id);
}

export function leaveClub(clubName) {
  const club = state.allEvents.find(e => e.isClub && e.title === clubName);
  if (!club) return;

  // Show confirm modal instead of browser confirm
  if(window.openConfirmModal) {
      window.openConfirmModal(`Are you sure you want to leave ${clubName}?`, () => {
          const members = club.clubMembers ? JSON.parse(club.clubMembers) : [];
          const filteredMembers = members.filter(m => m.userId !== 'currentUser'); // Mock ID
          club.clubMembers = JSON.stringify(filteredMembers);
          saveData();
          renderApp();
      });
  } else {
      // Fallback
      if(confirm(`Leave ${clubName}?`)) {
          const members = club.clubMembers ? JSON.parse(club.clubMembers) : [];
          const filteredMembers = members.filter(m => m.userId !== 'currentUser');
          club.clubMembers = JSON.stringify(filteredMembers);
          saveData();
          renderApp();
      }
  }
}

export function handleClubApplication(e) {
    e.preventDefault();
