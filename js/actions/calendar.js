import { state } from '../state.js';

export async function addToGoogleCalendar(eventId) {
  const event = state.allEvents.find(e => e.id === eventId);
  if (!event) return;

  // Retrieve token from state or local storage
  const token = state.googleAccessToken || localStorage.getItem('googleAccessToken');

  if (!token) {
    alert("Please log out and sign in with Google again to enable Calendar integration.");
    return;
  }

  const btn = document.querySelector(`button[data-event-id="${eventId}"]`);
  const originalText = btn ? btn.innerText : '';
  if (btn) btn.innerText = 'Saving...';

  try {
    // Construct Start and End times
    // Assuming event.date is YYYY-MM-DD and event.time is HH:MM
    // We default duration to 1 hour if no end time is specified
    const startTimeStr = `${event.date}T${event.time}:00`;
    const startDate = new Date(startTimeStr);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour

    // Handle Invalid Date
    if (isNaN(startDate.getTime())) {
      throw new Error("Invalid event date/time format");
    }

    const eventResource = {
      summary: event.title,
      location: event.location,
      description: event.description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventResource)
    });

    if (response.ok) {
      alert(`Successfully added "${event.title}" to your Google Calendar!`);
    } else {
      const errorData = await response.json();
      console.error('Google Calendar API Error:', errorData);
      
      if (response.status === 401) {
         alert("Session expired. Please log out and log in again with Google.");
      } else {
         alert("Failed to add event to calendar. Check console for details.");
      }
    }
  } catch (error) {
    console.error('Calendar Error:', error);
    alert("An error occurred while connecting to Google Calendar.");
  } finally {
    if (btn) btn.innerText = originalText;
  }
}