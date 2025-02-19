import React, { useState } from "react";
import "./Requests.css";
import MyRequests from "./MyRequests";
import NewRequest from "./NewRequest";

const Requests = () => {
  const [activeView, setActiveView] = useState<"myRequests" | "newRequest">(
    "myRequests"
  );

  return (
    <div className="requestContainer">
      <div className="buttonContainer">
        <button
          className={`toggleButton ${
            activeView === "myRequests" ? "active" : ""
          }`}
          onClick={() => setActiveView("myRequests")}
        >
          Saját Kérelmeim
        </button>
        <button
          className={`toggleButton ${
            activeView === "newRequest" ? "active" : ""
          }`}
          onClick={() => setActiveView("newRequest")}
        >
          Új kérelem
        </button>
        <div className="requestContent">
          {activeView === "myRequests" && <MyRequests />}
          {activeView === "newRequest" && <NewRequest />}
        </div>
      </div>
    </div>
  );
};

export default Requests;
