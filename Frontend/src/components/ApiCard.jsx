import React from "react";

export default function ApiCard({ item }) {
  const { video_id, transcript } = item;
  return (
    <article className="card">
      <div className="card-header">
        <strong>{video_id}</strong>
      </div>
      <div className="card-body">
        <p>{transcript || "(no transcript returned)"}</p>
      </div>
    </article>
  );
}
