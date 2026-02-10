# 🤖 Meeting Audit & Validation System (Back-end Architecture)

A robust LLM-orchestration system designed for automated semantic auditing of meeting data. This system validates formal documentation against raw verbal data to ensure integrity, compliance, and sentiment alignment using a deterministic logic layer on top of probabilistic AI outputs.

---

## 🛠️ Core Functional Modules

### 1. Semantic Integrity Validation (MoM vs. Transcript)
The system performs a high-granularity cross-reference between the **Minutes of Meeting (MoM)** and the **Raw Transcript**.
- **Source of Truth**: The raw transcript is treated as the immutable reference.
- **Inference Logic**: The AI identifies factual discrepancies (incorrect points), logical omissions (missing points), and validates existing accurate entries.
- **Verification Class**: Multi-point cross-verification.

### 2. Agenda Compliance Tracking
Automated analysis of conversation flow against predefined agenda items.
- **Granular Mapping**: For every agenda item, the system searches for specific discussion evidence in the transcript.
- **Coverage Metrics**: Provides a `discussed/total` ratio and a calculated coverage percentage.

### 3. Entity-Specific Sentiment Analysis (Client-Centric)
Targeted extraction of specific stakeholder entities to evaluate tonal variations.
- **Target Filtering**: Specifically scoped to analyze client statements (e.g., John, Tommy) to filter out internal bias.
- **Behavioral Signals**: Identification of explicit verbal cues indicating project risk, satisfaction, or friction.

### 4. Scope Creep Detection
Identifies discussion topics that deviate from the authorized domain boundaries.
- **Domain Delta**: Calculates the semantic difference between the input Agenda items and the actual discusion topics found in the Transcript.

---

## 🏗️ Technical Architecture (n8n JSON Workflow)

The system is implemented as an asynchronous orchestration pipeline within **n8n**, utilizing **Google Gemini 2.5 Flash** via LangChain for high-throughput semantic processing.

### Workflow Pipeline Details:
1. **Ingestion Tier**: REST API Webhook (`/analyze-meeting`) accepting JSON payloads: `{ agenda, transcript, mom }`.
2. **Parallel Validation Tier**: 
    - Concurrent execution of four specialized **LangChain ChainLLM** nodes.
    - **Zero-Shot Prompting**: Each chain is constrained by strict System Prompts to ensure output is restricted to the specific audit task.
3. **Data Sanitization Layer**: 
    - Custom JavaScript **Code Nodes** (e.g., `Parse Agenda Validation`) utilize regex-based sanitization to strip LLM markdown artifacts (e.g., ` ```json `) to ensure raw JSON compatibility.
4. **Deterministic Aggregation Engine**:
    - **Node**: `Final Validation Report` (JS Logic Node).
    - **Logic Operations**:
        - `agenda_coverage`: Dynamic calculation based on Boolean discussion flags.
        - `mom_accuracy_status`: Enum-based status mapping (`Accurate` vs `Partially Accurate`).
        - `overall_risk_level`: Heuristic-based calculation:
            - **High**: Triggered if `client_mood.overall === "Negative"`.
            - **Medium**: Triggered if factual discrepancies exist or out-of-scope topics are identified.
            - **Low**: Optimal state with high coverage and positive sentiment.
5. **Egress Tier**: Synchronous webhook response delivering the unified `Final Validation Report` object.

---

## 🔧 Technical Use Cases
- **Regulatory Compliance**: Ensuring mandatory meeting structures are followed.
- **Account Management**: Early warning system for client churn based on sentiment signals.
- **Audit Trails**: Programmatic verification of meeting minutes for QA and project management records.
