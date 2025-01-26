import React from "react";
import "./Loading.css";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="book-loader">
        <div className="book">
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
        </div>
      </div>
      <h1>Betöltés...</h1>
    </div>
  );
};

export default Loading;
