import React from "react";

export default function Header({ title }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <h1 className="project-title">{title}</h1>
      </div>
    </header>
  );
}
