# 🤖 AI Meeting Auditor & Autopilot

A complete **End-to-End Meeting Intelligence System** that automates the lifecycle of meeting auditing. From joining calls automatically to generating deep semantic analysis reports, this system leverages **React**, **Meeting BaaS**, and **n8n** with **Google Gemini** models.

---

## 🚀 Key Features

### 1. 📅 Automated Meeting Pilot
- **Direct Google Calendar Integration**: Fetches upcoming meetings securely.
- **One-Click Join**: Instantly deploying an AI bot to Google Meet, Zoom, or Teams calls via **Meeting BaaS** API.
- **Smart Proxying**: Uses a robust proxy layer (Local & Vercel) to bypass CORS and securely route API requests.

### 2. 🧠 Granular AI Analysis (The "Autopilot" Engine)
Instead of a generic summary, the system performs a **4-Step Deep Dive** on every meeting transcript:
1.  **Detailed MoM Generation**: Extracts key discussion points, decisions, and action items.
2.  **Agenda Compliance**: Verifies if planned agenda items were actually discussed using evidence-based checking.
3.  **Client Sentiment Analysis**: Detects underlying mood and signals from client statements (Positive/Neutral/Negative).
4.  **Scope Creep Detection**: Identifies topics discussed that were *not* on the agenda.

### 3. 📩 Beautiful HTML Reports
- Delivers a structured, colour-coded **HTML Email Report** to the organizer immediately after the meeting.
- Includes **Risk Scores**, **Compliance Badges**, and **Actionable Insights**.

### 4. 🎯 Mission Configuration & Agile Agendas
- **Agile Meeting Context**: Not every meeting has a perfect calendar description. The **Mission Configuration Modal** allows users to inject a custom agenda or specific instructions right before the meeting starts.
- **Dynamic Context Injection**: The AI auditor receives this custom context to tailor its analysis (e.g., "Focus on budget approval", or "Watch for client hesitation").

---

## 🏗️ Technical Architecture

### **Frontend (React)**
- **Framework**: React 19 (CRA)
- **Styling**: Custom CSS variables, Glassmorphism UI, Framer Motion for animations.
- **Authentication**: Google OAuth 2.0.
- **API Handling**: Direct Axios calls with a **Local vs. Cloud Proxy Strategy**:
    - **Development**: Uses the standardized `proxy` field in `package.json` to route `/v2/bots` requests to Meeting BaaS, bypassing local CORS issues.
    - **Production**: Vercel Rewrites (`vercel.json`) handles the same routing, ensuring secure API communication on the live site.

### **Automation (n8n Workflow)**
- **File**: `AI_Meeting_Autopilot.json`
- **Trigger**: Webhook from Meeting BaaS (when meeting ends).
- **Process**:
    1.  **Fetch Transcript**: Retrieves audio/text from the bot.
    2.  **Parallel Chains**: Runs 4 separate LangChain/Gemini nodes for specific analysis tasks.
    3.  **Data Sanitization**: Custom code nodes to strip Markdown artifacts (`cleanJson` logic).
    4.  **HTML Generation**: Assembles the final report dynamically.
    5.  **Email Delivery**: Sends the report via Gmail.

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v16+)
- **n8n Instance** (Self-hosted or Cloud)
- **Meeting BaaS API Key**
- **Google Cloud Console Project** (for OAuth)

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
REACT_APP_MEETING_BAAS_API_KEY=your_meeting_baas_api_key
```

### 3. Installation
```bash
# Install dependencies
npm install

# Start the development server (with Proxy enabled)
npm start
```
The app will run at `http://localhost:3000`.

### 4. n8n Workflow Setup
1.  Open your n8n instance.
2.  Import the **`AI_Meeting_Autopilot.json`** file included in this repo.
3.  Configure the **Gmail Credential** node with your own credentials.
4.  Ensure the **Google Gemini Chat Model** credentials are set.
5.  Activate the workflow.

---

## 🌍 Deployment (Vercel)

This project is optimized for **Vercel**.
The `vercel.json` file handles the API proxying for production:

```json
{
  "rewrites": [
    { "source": "/v2/bots", "destination": "https://api.meetingbaas.com/v2/bots" },
    { "source": "/webhook-test/:path*", "destination": "https://n8n-q8ji.onrender.com/webhook-test/:path*" }
  ]
}
```

Simply push to your repository and connect it to Vercel. The rewrites will activate automatically.

---

## 📝 License
MIT License. Built by Ravinder Negi.
