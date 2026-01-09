import { state } from '../state.js';
import { saveData } from '../storage.js';
import { renderApp } from '../ui/appShell.js';

export function joinClub(clubName) {
  let club = state.allEvents.find(e => e.isClub && e.title === clubName);
  
  if (!club) {
    let category = 'Social';
    if (clubName.includes('Computer') || clubName.includes('IEEE')) category = 'Academic';
    if (clubName.includes('Sports')) category = 'Sports';
    if (clubName.includes('Drama')) category = 'Cultural';
    if (clubName.includes('Debate')) category = 'Academic';

    club = {
      id: Date.now().toString(),
      title: clubName,
      organization: clubName,
      category: category,
      date: '',
      time: '',
      location: 'Main Campus',
      description: `Official ${clubName} of the college`,
      questions: JSON.stringify([]),
      registrations: JSON.stringify({}),
      isSubscribed: false,
      isClub: true,
      clubMembers: JSON.stringify([{ userId: 'currentUser', joinedAt: new Date().toISOString() }]),
      createdAt: new Date().toISOString()
    };
    state.allEvents.push(club);
  } else {
    const members = club.clubMembers ? JSON.parse(club.clubMembers) : [];
    members.push({ userId: 'currentUser', joinedAt: new Date().toISOString() });
    club.clubMembers = JSON.stringify(members);
  }

  saveData();
  renderApp();
}

export function leaveClub(clubName) {
  const club = state.allEvents.find(e => e.isClub && e.title === clubName);
  if (!club) return;

  const members = club.clubMembers ? JSON.parse(club.clubMembers) : [];
  const filteredMembers = members.filter(m => m.userId !== 'currentUser');
  club.clubMembers = JSON.stringify(filteredMembers);

  saveData();
  renderApp();
}