import { state } from '../state.js';
import { renderApp } from '../ui/appShell.js';
import { openRegistrationModal } from './events.js';
import { updateEventInFirebase } from '../storage.js'; // Ensure this is imported if used, otherwise remove/adjust

export function joinClub(clubName) {
  let club = state.allEvents.find(e => e.isClub && e.title === clubName);
  
  // Questions for the club application
  const applicationQuestions = [
    { id: 'fullname', question: 'Full Name', required: true, yesNoType: false },
    { id: 'studentId', question: 'Student ID', required: true, yesNoType: false },
    { id: 'department', question: 'Department', required: true, yesNoType: false },
    { id: 'year', question: 'Year of Study', required: true, yesNoType: false },
    { id: 'reason', question: 'Why do you want to join this organization?', required: true, yesNoType: false }
  ];

  if (!club) {
    let category = 'Social';
    if (clubName.includes('Computer') || clubName.includes('IEEE')) category = 'Academic';
    if (clubName.includes('Sports')) category = 'Sports';
    if (clubName.includes('Drama')) category = 'Cultural';
    if (clubName.includes('Debate')) category = 'Academic';

    // Create a temporary club object if it doesn't exist in our state yet
    // Note: In a real app with Firebase, you might want to fetch or create this differently
    club = {
      id: 'temp-' + Date.now(),
      title: clubName,
      organization: clubName,
      category: category,
      date: '',
      time: '',
      location: 'Main Campus',
      description: `Official ${clubName} of the college`,
      questions: JSON.stringify(applicationQuestions),
      registrations: JSON.stringify({}),
      isSubscribed: false,
      isClub: true,
      clubMembers: JSON.stringify([]),
      createdAt: new Date().toISOString()
    };
    // Push temporarily to state so modal can find it
    state.allEvents.push(club);
  } else {
    // Ensure existing clubs have questions
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

  const performLeave = async () => {
    const members = club.clubMembers ? JSON.parse(club.clubMembers) : [];
    // Using current user ID or anon
    const userId = state.currentUser?.uid || 'anon';
    const filteredMembers = members.filter(m => m.userId !== userId);
    
    // Update Firebase
    if (club.id && !club.id.startsWith('temp-')) {
       await updateEventInFirebase(club.id, { clubMembers: JSON.stringify(filteredMembers) });
    }
    
    // Optimistic update
    club.clubMembers = JSON.stringify(filteredMembers);
    renderApp();
  };

  if(window.openConfirmModal) {
      window.openConfirmModal(`Are you sure you want to leave ${clubName}?`, performLeave);
  } else {
      if(confirm(`Leave ${clubName}?`)) {
          performLeave();
      }
  }
}

export function handleClubApplication(e) {
    e.preventDefault();
    // Logic handled by handleRegistration in events.js since we reuse that modal
}
