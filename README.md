# 🤖 Meeting Audit & Validation System (Back-end Architecture)

A robust LLM-orchestration system designed for automated semantic auditing of meeting data. This system validates formal documentation against raw verbal data to ensure integrity, compliance, and sentiment alignment.

---

## 🛠️ Core Functional Modules

### 1. Semantic Integrity Validation (MoM vs. Transcript)
The system performs a high-granularity cross-reference between the **Minutes of Meeting (MoM)** and the **Raw Transcript**. 
- **Inference Goal**: Identify factual discrepancies and logical omissions.
- **Methodology**: LLM-based verification where the transcript is treated as the immutable source of truth.

### 2. Agenda Compliance Tracking
Automated analysis of conversation flow against predefined agenda items.
- **Logical Flow**: Extracts discussion points and maps them to an input array of agenda objects.
- **Output**: Coverage metrics and evidence-based confirmation for each discussed item.

### 3. Client Sentiment & Behavioral Analysis
Targeted extraction of specific speaker entities (Client/Stakeholder) to evaluate tonal variations.
- **Signals**: Identification of explicit verbal signals that indicate project risk or satisfaction.
- **Classification**: Sentiment categorization (Positive/Neutral/Negative) mapped to raw statement evidence.

### 4. Scope Creep Detection
Identifies discussion topics that deviate from the authorized meeting scope (Agenda).
- **Mechanism**: Differencing the discovered semantic topics in the transcript against the agenda's domain boundaries.

---

## 🏗️ Technical Implementation (n8n Workflow)

The system is implemented as an asynchronous orchestration pipeline within **n8n**, utilizing **Google Gemini 2.5 Flash** for high-throughput semantic processing.

### Workflow Architecture:
- **Ingestion Tier**: REST API Webhook accepting structured JSON payloads containing `agenda`, `transcript`, and `mom` (Minutes of Meeting) as string buffers.
- **Parallel Processing Layer**: 
    - **Extraction Chains**: Specialized LLM chains running concurrent validation tasks to minimize latency.
    - **Prompt Engineering**: System instructions focused on zero-shot extraction with strict JSON enforcement.
- **Logic & Parsing Tier**: 
    - Post-processing nodes to normalize LLM outputs (removal of markdown artifacts, JSON sanitization).
    - Heuristic-based logic to aggregate results from parallel chains.
- **Risk Assessment Engine**: 
    - A centralized logic node that calculates an **Overall Risk Level** based on:
        - Presence of factual discrepancies in MoM.
        - Negative sentiment triggers from client-side statements.
        - Volume of out-of-scope discussion topics.
- **Egress Tier**: Synchronous webhook response delivering a unified analysis report.

---

## 🔧 Workflow Configuration

### System Requirements
- **Orchestrator**: n8n (Self-hosted or Cloud)
- **Model**: Google Gemini 2.5 Flash (via LangChain integration)
- **Protocol**: HTTP/HTTPS POST

### Integration Logic
The pipeline expects a `POST` request to the following endpoint structure:
```json
{
  "agenda": "string",
  "transcript": "string",
  "mom": "string"
}
```

### Data Normalization
AI outputs are passed through custom JavaScript nodes to ensure all string-based LLM responses are parsed into machine-readable objects, enabling downstream programmatic consumption of the audit data.

---

## 📊 Technical Use Cases
- **automated Compliance Auditing**: Ensuring regulated meetings follow strict agendas.
- **Project Risk Mitigation**: Early detection of client dissatisfaction via automated transcript sentiment analysis.
- **Documentation Quality Assurance**: Verifying that human-written meeting minutes accurately reflect verbal agreements.
