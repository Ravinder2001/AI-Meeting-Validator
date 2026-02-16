import axios from 'axios';

const CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export const fetchUpcomingMeetings = async (token) => {
  try {
    const response = await axios.get(CALENDAR_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      },
    });
    return response.data.items || [];
  } catch (error) {
    console.error("Calendar Service Error:", error);
    throw error;
  }
};
