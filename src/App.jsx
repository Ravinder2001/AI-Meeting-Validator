import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, CheckCircle, AlertTriangle, ShieldAlert, Activity, Smile, Frown, Meh, XCircle, Clock, Search } from "lucide-react";
import "./App.css";

const YOUR_N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/analyze-meeting";

function App() {
  const [agenda, setAgenda] = useState("");
  const [transcript, setTranscript] = useState("");
  const [mom, setMom] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const readFile = (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target.result);
    reader.readAsText(file);
  };

  const analyzeMeeting = async () => {
    if (!agenda || !transcript || !mom) {
      alert("Please upload all three files");
      return;
    }

    setLoading(true);
    setStage("Starting analysis...");
    setResult(null);
    setError("");

    try {
      // Start backend call concurrently
      const fetchPromise = fetch(YOUR_N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agenda, transcript, mom }),
      });

      // UI-driven progress stages (approx 1 minute total)
      setStage("Analyzing agenda coverage...");
      await new Promise((r) => setTimeout(r, 13000));

      setStage("Validating Minutes of Meeting...");
      await new Promise((r) => setTimeout(r, 13000));

      setStage("Detecting client sentiment...");
      await new Promise((r) => setTimeout(r, 13000));

      setStage("Checking for out-of-scope topics...");
      await new Promise((r) => setTimeout(r, 13000));

      // If fetch is still pending, this message will show
      setStage("Analysis is taking a bit longer than usual...");

      // Await the response
      const response = await fetchPromise;

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      setStage("Analysis complete");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while analyzing the meeting. Please try again.");
      setStage("");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === "High") return "var(--danger)";
    if (level === "Medium") return "var(--warning)";
    return "var(--success)";
  };

  const getRiskClass = (level) => {
    if (level === "High") return "risk-high";
    if (level === "Medium") return "risk-medium";
    return "risk-low";
  };

  const renderFileUploader = (label, fileContent, setter) => (
    <motion.div
      className="upload-card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>{label}</h3>
      <div className={`file-input-wrapper ${fileContent ? "has-file" : ""}`}>
        <input
          type="file"
          accept=".txt,.md"
          onChange={(e) => readFile(e.target.files[0], setter)}
          style={{ opacity: 0, position: "absolute", width: "100%", height: "100%", cursor: "pointer" }}
        />
        {fileContent ? <CheckCircle className="file-icon" color="var(--success)" /> : <Upload className="file-icon" />}
        <span>{fileContent ? "File Uploaded" : "Click to Upload"}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="app-container">
      <motion.div className="header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="title">Meeting Validator Assistant</h1>
        <p className="subtitle">Upload your meeting documents for instant AI analysis</p>
      </motion.div>

      <div className="upload-grid">
        {renderFileUploader("Agenda", agenda, setAgenda)}
        {renderFileUploader("Transcript", transcript, setTranscript)}
        {renderFileUploader("MoM", mom, setMom)}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
        <motion.button className="analyze-btn" onClick={analyzeMeeting} disabled={loading} whileTap={{ scale: 0.95 }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="loader"></span> Processing...
            </span>
          ) : (
            "Analyze Meeting"
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            className="loading-container"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "40px 60px",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
              }}
            >
              <Activity size={64} color="#6366f1" style={{ animation: "spin 2s linear infinite" }} />
              <p className="loading-text">{stage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          className="error-banner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--danger)",
            padding: "16px",
            borderRadius: "8px",
            color: "var(--danger)",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="results-grid">
              {/* Agenda Coverage */}
              <motion.div className="result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)" }}>
                  <FileText size={20} />
                  <span>Agenda Coverage</span>
                </div>
                <div className="result-value">{result.agenda_coverage_percentage}%</div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.agenda_coverage_percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ height: "100%", background: "var(--primary-gradient)", borderRadius: "3px" }}
                  />
                </div>
              </motion.div>

              {/* MoM Accuracy */}
              <motion.div className="result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)" }}>
                  <CheckCircle size={20} />
                  <span>MoM Accuracy</span>
                </div>
                <div className="result-value" style={{ fontSize: "1.8rem" }}>
                  {result.mom_accuracy_status}
                </div>
              </motion.div>

              {/* Client Mood */}
              <motion.div className="result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-secondary)" }}>
                  <Smile size={20} />
                  <span>Client Mood</span>
                </div>
                <div className="result-value" style={{ fontSize: "1.8rem" }}>
                  {result.client_mood.overall}
                </div>
              </motion.div>

              {/* Risk Level */}
              <motion.div
                className={`result-card ${getRiskClass(result.overall_risk_level)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ border: `1px solid ${getRiskColor(result.overall_risk_level)}` }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: getRiskColor(result.overall_risk_level) }}>
                  <ShieldAlert size={20} />
                  <span>Overall Risk</span>
                </div>
                <div
                  className="result-value"
                  style={{ color: getRiskColor(result.overall_risk_level), background: "none", WebkitTextFillColor: "initial" }}
                >
                  {result.overall_risk_level}
                </div>
              </motion.div>
            </div>

            {/* Detailed Analysis */}
            <div className="results-grid">
              <motion.div
                className="result-card"
                style={{ gridColumn: "span 2" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Search size={24} color="#6366f1" /> MoM Detailed Analysis
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <h4 style={{ color: "var(--success)", marginBottom: "15px" }}>Accurate Points</h4>
                    {!result.mom_summary?.accurate_points || result.mom_summary.accurate_points.length === 0 ? (
                      <p style={{ color: "var(--text-secondary)" }}>No accurate points identified</p>
                    ) : (
                      result.mom_summary.accurate_points.map((point, i) => (
                        <div key={i} className="list-item">
                          <CheckCircle size={16} color="var(--success)" style={{ marginTop: "4px", flexShrink: 0 }} />
                          <span>{point}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div>
                    <h4 style={{ color: "var(--danger)", marginBottom: "15px" }}>Discrepancies</h4>
                    {(!result.mom_summary?.incorrect_points || result.mom_summary.incorrect_points.length === 0) &&
                    (!result.mom_summary?.missing_points || result.mom_summary.missing_points.length === 0) ? (
                      <p style={{ color: "var(--text-secondary)" }}>No discrepancies found</p>
                    ) : (
                      <>
                        {result.mom_summary.incorrect_points?.map((point, i) => (
                          <div key={`inc-${i}`} className="list-item">
                            <XCircle size={16} color="var(--danger)" style={{ marginTop: "4px", flexShrink: 0 }} />
                            <span>{point}</span>
                          </div>
                        ))}
                        {result.mom_summary.missing_points?.map((point, i) => (
                          <div key={`mis-${i}`} className="list-item">
                            <AlertTriangle size={16} color="var(--warning)" style={{ marginTop: "4px", flexShrink: 0 }} />
                            <span>Missing: {point}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div className="result-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Activity size={24} color="#a855f7" /> Mood Signals
                </h3>
                <p>
                  <strong>Overall:</strong> {result.client_mood?.overall}
                </p>
                <div style={{ marginTop: "15px" }}>
                  {!result.client_mood?.signals || result.client_mood.signals.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)" }}>No specific signals detected</p>
                  ) : (
                    result.client_mood.signals.map((signal, i) => (
                      <div key={i} className="list-item">
                        <span>• {signal}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Out of Scope */}
            {result.out_of_scope_topics?.length > 0 && (
              <motion.div
                className="result-card"
                style={{ marginTop: "24px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Clock size={24} color="#f59e0b" /> Out of Scope Topics
                </h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {result.out_of_scope_topics.map((topic, i) => (
                    <span
                      key={i}
                      style={{
                        background: "rgba(245, 158, 11, 0.1)",
                        color: "#f59e0b",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
