import React from "react";
import "./Loading.css";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <h1>Bejelentkezés folyamatban...</h1>
      <div className="loading-bar">
        <div className="progress"></div>
      </div>
    </div>
  );
};

export default Loading;
