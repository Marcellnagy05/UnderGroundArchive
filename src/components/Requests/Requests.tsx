import { useState } from "react";
import MyRequests from "./MyRequests";
import NewRequest from "./NewRequest";
import "./Requests.css";

const Request = () => {
  const [activeView, setActiveView] = useState("myRequests");

  return (
    <div className="requestContainer">
      <div
        className={`requestContent ${
          activeView === "myRequests" ? "myRequestsActive" : "newRequestActive"
        }`}
      >
        <div className="myRequestsContainer">
          <MyRequests />
        </div>
        <div className="newRequestContainer">
          <NewRequest />
        </div>
      </div>

      <div className="buttons-container">
        {activeView === "newRequest" && (
          <button
            className="request-slide-button left"
            onClick={() => setActiveView("myRequests")}
          >
            ← <strong className="arrow-words">Kérelmeim</strong>
          </button>
        )}
        {activeView === "myRequests" && (
          <button
            className="request-slide-button right"
            onClick={() => setActiveView("newRequest")}
          >
           <strong className="arrow-words">Új kérelem</strong> →
          </button>
        )}
      </div>
    </div>
  );
};

export default Request;
