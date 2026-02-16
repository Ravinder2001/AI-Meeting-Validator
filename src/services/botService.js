import axios from 'axios';

// API URL (Proxied via package.json for local dev, via vercel.json for production)
const MEETING_BAAS_API_URL = "/v2/bots";

export const joinMeeting = async (meeting, user) => {
  const apiKey = process.env.REACT_APP_MEETING_BAAS_API_KEY;
  if (!apiKey) throw new Error("Missing Meeting BaaS API Key in .env file!");

  // Prioritize hangoutLink, checks for location if link missing
  const meetingUrl = meeting.hangoutLink || meeting.location;
  if (!meetingUrl) throw new Error("No meeting link found (Google Meet or location)!");

  const payload = {
    meeting_url: meetingUrl,
    bot_name: "AI Meeting Auditor",
    recording_mode: "speaker_view",
    reserved: new Date(meeting.start.dateTime) > new Date(),
    entry_time: meeting.start.dateTime,
    webhook_url: "https://n8n-q8ji.onrender.com/webhook/autopilot",
    transcription_enabled: true,
    transcription_config: { provider: "gladia" },
    extra: {
      organizer_email: user?.email || meeting.organizer?.email || "ravinder.s.negi@intglobal.com",
      title: meeting.summary,
      agenda: meeting.description || "No description provided"
    }
  };

  console.log("Sending Bot Payload:", payload);

  try {
    const response = await axios.post(MEETING_BAAS_API_URL, payload, {
      headers: {
        "x-meeting-baas-api-key": apiKey,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Bot Service Error:", error);
    throw error;
  }
};
