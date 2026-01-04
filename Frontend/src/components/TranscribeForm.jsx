import React, { useState } from "react";

export default function TranscribeForm({ onSuccess, backendBase }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(endpoint) {
    if (loading) return; // Prevent double submit
    setError(null);
    if (!url) return setError("Please enter a YouTube URL or ID.");
    setLoading(true);
    try {
      const res = await fetch(`${backendBase}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtube_url: url }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || `Status ${res.status}`);
      }
      const data = await res.json();
      onSuccess(data);
      // setUrl(""); // Optional: clear URL after success, or keep it for next action? Keep it is better for UX if they want to summarize after transcribing.
    } catch (e) {
      setError(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="transcribe-form" onSubmit={handleSubmit}>
      <label className="label">YouTube URL or ID</label>
      <div className="input-row">
        <input
          className="input"
          placeholder="https://youtu.be/VIDEO_ID or VIDEO_ID"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="btn"
          type="submit"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit("/transcribe");
          }}
        >
          {loading ? "Working..." : "Transcribe"}
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit("/summarize");
          }}
          style={{ marginLeft: "0.5rem", backgroundColor: "#646cff" }}
        >
          {loading ? "Working..." : "Summarize"}
        </button>
      </div>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
}
