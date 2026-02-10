# 🤖 Meeting Validator Assistant

[![n8n](https://img.shields.io/badge/Workflow-n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

An advanced AI-powered meeting auditing system that validates Minutes of Meeting (MoM) against transcripts, ensures agenda compliance, and analyzes client sentiment.

---

## ✨ Key Features

- **📑 MoM Accuracy Validation**: Automatically identifies accurate points, incorrect statements, and missing information in your meeting minutes.
- **🎯 Agenda Coverage**: Calculates the percentage of agenda items discussed during the session.
- **🎭 Client Mood Detection**: Analyzes client statements to detect sentiment (Positive, Neutral, Negative) and highlights specific mood signals.
- **🚫 Out-of-Scope Detection**: Flags topics discussed that were not part of the initial agenda.
- **⚠️ Risk Assessment**: Provides an overall risk level (Low, Medium, High) based on meeting discrepancies and sentiment.
- **🎨 Glassmorphic UI**: A premium, responsive dashboard built with Framer Motion for smooth animations and a modern feel.

---

## 🏗️ Technical Architecture

### Frontend (User Interface)
- **Framework**: React.js
- **Styling**: Vanilla CSS with CSS Variables for a robust design system.
- **Animations**: `framer-motion` for complex transitions and state-based animations.
- **Icons**: `lucide-react` for consistent, crisp iconography.
- **Data Flow**: Handles file uploads and orchestrates the multi-stage analysis progress UI before displaying results.

### Backend (n8n Workflow)
The brain of the application is a sophisticated **n8n workflow** that leverages Large Language Models (LLMs) for deep semantic analysis.

#### workflow Breakdown:

1.  **Webhook Trigger**: Receives the meeting documents (Agenda, Transcript, MoM) via a POST request.
2.  **Meeting Documents Node**: Extracts and prepares the raw text for processing.
3.  **Parallel AI Validation (Google Gemini 2.5 Flash)**:
    *   **MoM Accuracy Chain**: Cross-references the MoM against the transcript to find errors.
    *   **Agenda Validation Chain**: Scans the transcript for evidence of each agenda item.
    *   **Client Mood Chain**: Specifically filters and analyzes statements made by clients.
    *   **Out-of-Scope Chain**: Identifies "scope creep" by comparing discussed topics to the agenda.
4.  **Parsing Logic**: Specialized JavaScript nodes clean the AI outputs, handling potential formatting issues to ensure valid JSON data.
5.  **Join & Report Generation**: A final aggregation node joins all parallel outputs and calculates meta-metrics (like % coverage and risk level).
6.  **Response Node**: Returns the structured report to the React frontend.

---

## 🚀 Setup & Installation

### 1. n8n Workflow Setup
1.  Install and run [n8n](https://n8n.io/get-started/).
2.  Import the `AI_Meeting_Validation.json` file found in the root of this repository.
3.  Configure your **Google Gemini API credentials** in the LangChain nodes.
4.  Activate the workflow and copy the **Production Webhook URL**.

### 2. Frontend Configuration
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Open `src/App.jsx` and update the `YOUR_N8N_WEBHOOK_URL` constant with your n8n webhook URL:
    ```javascript
    const YOUR_N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/analyze-meeting";
    ```
4.  Start the development server:
    ```bash
    npm start
    ```

---

## 📊 How It Works (Internal Logic)

The system treats the **Transcript** as the "Source of Truth." The AI models are instructed to strictly follow these rules:
- **No Assumptions**: If it's not in the transcript, it didn't happen.
- **Strict JSON**: All outputs are formatted as JSON for seamless integration.
- **Risk Calculation**:
    - **High Risk**: Triggered by Negative client mood or critical MoM inaccuracies.
    - **Medium Risk**: Triggered by out-of-scope discussions or minor discrepancies.
    - **Low Risk**: High agenda coverage and accurate MoM.

---

## 🎨 Design System

The UI uses a curated color palette:
- **Primary Gradient**: `#6366f1` to `#a855f7` (Indigo to Purple)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Rose)
- **Background**: Modern deep navy/black theme with translucent cards.

---

Developed with ❤️ for streamlined meeting management.
