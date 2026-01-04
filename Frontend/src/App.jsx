import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TranscribeForm from "./components/TranscribeForm";
import ApiCard from "./components/ApiCard";

const BACKEND_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [health, setHealth] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHealth() {
      setLoadingHealth(true);
      try {
        const res = await fetch(`${BACKEND_BASE}/health`);
        const data = await res.json();
        setHealth(data);
      } catch (e) {
        setError("Failed to reach backend");
      } finally {
        setLoadingHealth(false);
      }
    }
    fetchHealth();
  }, []);

  function addItem(item) {
    setItems((s) => [item, ...s]);
  }

  return (
    <div className="app-root">
      <Header title="YouTube Transcribe + Gemini" />
      <main className="container">
        <section className="status-row">
          <div className="status-card">
            <h4>Backend</h4>
            {loadingHealth ? (
              <div className="muted">Checking...</div>
            ) : health ? (
              <div className="ok">{health.status}</div>
            ) : (
              <div className="error">{error || "Unavailable"}</div>
            )}
          </div>

          <div className="status-card">
            <h4>Recent Results</h4>
            <div className="muted">Showing last {items.length} result(s)</div>
          </div>
        </section>

        <section className="form-row">
          <TranscribeForm onSuccess={addItem} backendBase={BACKEND_BASE} />
        </section>

        <section className="cards-grid">
          {items.length === 0 ? (
            <div className="muted">No transcripts yet — submit a YouTube URL above.</div>
          ) : (
            items.map((it, idx) => <ApiCard key={idx} item={it} />)
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
