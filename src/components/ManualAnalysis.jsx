import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, CheckCircle, AlertTriangle, ShieldAlert, Activity, Smile, XCircle, Clock, Search } from "lucide-react";

const YOUR_N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/analyze-meeting";

const ManualAnalysis = () => {
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
      const fetchPromise = fetch(YOUR_N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agenda, transcript, mom }),
      });

      setStage("Analyzing agenda coverage...");
      await new Promise((r) => setTimeout(r, 13000));

      setStage("Validating Minutes of Meeting...");
      await new Promise((r) => setTimeout(r, 13000));

      setStage("Detecting client sentiment...");
      await new Promise((r) => setTimeout(r, 13000));

      setStage("Checking for out-of-scope topics...");
      await new Promise((r) => setTimeout(r, 13000));

      setStage("Finishing up...");
      const response = await fetchPromise;

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult(data);
      setStage("Analysis complete");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
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
    <div className="manual-analysis-container">
      <motion.div className="header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h2 className="title" style={{ fontSize: '2rem' }}>Manual Validator</h2>
        <p className="subtitle">Upload your documents for analysis</p>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
             <div className="loading-card" style={{ background: 'rgba(0,0,0,0.8)', padding: '40px', borderRadius: '20px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Activity size={64} color="#6366f1" style={{ animation: "spin 2s linear infinite" }} />
              <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>{stage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="error-banner" style={{ color: 'var(--danger)', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
             <div className="results-grid">
              {/* Reuse the existing result cards style */}
               <div className="result-card">
                 <h3>Agenda Coverage</h3>
                 <div className="result-value">{result.agenda_coverage_percentage}%</div>
               </div>
               <div className="result-card">
                 <h3>MoM Accuracy</h3>
                 <div className="result-value">{result.mom_accuracy_status}</div>
               </div>
               <div className="result-card">
                 <h3>Client Mood</h3>
                 <div className="result-value">{result.client_mood.overall}</div>
               </div>
               <div className={`result-card ${getRiskClass(result.overall_risk_level)}`} style={{ border: `1px solid ${getRiskColor(result.overall_risk_level)}` }}>
                 <h3 style={{ color: getRiskColor(result.overall_risk_level) }}>Risk Level</h3>
                 <div className="result-value" style={{ color: getRiskColor(result.overall_risk_level) }}>{result.overall_risk_level}</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManualAnalysis;
