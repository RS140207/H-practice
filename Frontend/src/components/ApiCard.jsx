import React from "react";

export default function ApiCard({ item }) {
  const { video_id, transcript, summary } = item;
  return (
    <article className="card">
      <div className="card-header">
        <strong>{video_id}</strong>
      </div>
      <div className="card-body">
        {summary && (
          <div
            className="summary-section"
            style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: transcript ? "1px solid #eee" : "none",
            }}
          >
            <h5 style={{ margin: "0 0 0.5rem 0", color: "#646cff" }}>
              Summary
            </h5>
            <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
          </div>
        )}
        {transcript && (
          <div className="transcript-section">
            {summary && (
              <h5 style={{ margin: "0 0 0.5rem 0", opacity: 0.7 }}>
                Transcript
              </h5>
            )}
            <p
              style={{
                whiteSpace: "pre-wrap",
                maxHeight: summary ? "300px" : "none",
                overflowY: summary ? "auto" : "visible",
              }}
            >
              {transcript}
            </p>
          </div>
        )}
        {!transcript && !summary && <p>(no content returned)</p>}
      </div>
    </article>
  );
}
