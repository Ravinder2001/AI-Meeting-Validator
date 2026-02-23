# 🤖 AI Meeting Auditor & Autopilot

A complete **End-to-End Meeting Intelligence System** that automates the lifecycle of meeting auditing. From joining calls automatically to generating deep semantic analysis reports, this system leverages **React**, **Meeting BaaS**, and **n8n** with **Google Gemini** models.

---

## 🚀 Key Features

### 1. 📅 Automated Meeting Pilot
- **Direct Google Calendar Integration**: Fetches upcoming meetings securely.
- **One-Click Join**: Instantly deploying an AI bot to Google Meet, Zoom, or Teams calls via **Meeting BaaS** API.
- **Real-time Persistence**: Uses **Supabase** to track bot status instantly. Even if the page is refreshed, the system remembers which meetings are currently being audited.

### 2. 🧠 Granular AI Analysis (The "Autopilot" Engine)
Instead of a generic summary, the system performs a **4-Step Deep Dive** on every meeting transcript:
1.  **Detailed MoM Generation**: Extracts key discussion points, decisions, and action items.
2.  **Agenda Compliance**: Verifies if planned agenda items were actually discussed using evidence-based checking.
3.  **Client Sentiment Analysis**: Detects underlying mood and signals from client statements (Positive/Neutral/Negative).
4.  **Scope Creep Detection**: Identifies topics discussed that were *not* on the agenda.

### 3. 📊 Interactive AI Reports & Dashboard
- **View Report Button**: Once the audit is complete, a "View AI Report" button appears directly on the dashboard.
- **Glassmorphism Modal**: Displays beautiful, structured reports with MoM, Decisions, and Action Items without leaving the page.
- **Beautiful HTML Reports**: Still delivers a structured, colour-coded email report to the organizer.

### 4. 🎯 Mission Configuration & Agile Agendas
- **Agile Meeting Context**: The **Mission Configuration Modal** allows users to inject a custom agenda or specific instructions right before the meeting starts.
- **Smart HTML Stripping**: Automatically cleans raw Google Calendar HTML for a readable editing experience.

---

## 🏗️ Technical Architecture

### **Frontend (React)**
- **Framework**: React 19
- **Data Layer**: **Supabase-js** for direct, real-time database interaction.
- **Styling**: Custom CSS variables, Glassmorphism UI, Framer Motion for animations.
- **Authentication**: Google OAuth 2.0.

### **Automation & Persistence (n8n + Supabase)**
- **Workflows**: `AI_Meeting_Autopilot.json` (Main Brain)
- **Database**: **PostgreSQL (Supabase)** stores:
    - `active_bots`: Tracks live auditing status.
    - `meeting_reports`: Stores the final structured JSON analysis for instant UI retrieval.
- **Process**:
    1.  **Fetch Transcript**: Retrieves audio/text from Meeting BaaS.
    2.  **Parallel AI Chains**: Runs 4 separate Gemini nodes for analysis.
    3.  **DB Update**: Automatically upserts the final report into Supabase.
    4.  **Email Delivery**: Sends the report via Gmail.

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
