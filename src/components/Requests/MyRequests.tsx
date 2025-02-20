import React, { useEffect, useState } from "react";
import { getMyRequests } from "../../services/RequestService";
import { myRequests } from "../../Types/Requests";

const MyRequests = () => {
  const [requests, setRequests] = useState<myRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getMyRequests(token || "");
        setRequests(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ismeretlen hiba");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="myRequestsContainer">
      {loading && <p>Betöltés...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="myRequestsBody">
      <h2>Saját kérelmeim</h2>
        {requests.length > 0 ? (
          requests.map((request, index) => (
            <div key={index} className="request">
              <div className="message">
                <strong>Kérelem szövege:</strong> {request.requestMessage}
              </div>
              <div className="status">
                <strong>Állapota:</strong>{" "}
                {request.isHandled ? "Jóváhagyva" : "Jóváhagyásra vár"}
              </div>
              <div className="decision">
                <strong>Döntés:</strong>{" "}
                {request.isHandled
                  ? request.isApproved
                    ? "Elfogadva"
                    : "Elutasítva"
                  : "-"}
              </div>
            </div>
          ))
        ) : (
          <p>Nincs elérhető kérelem.</p>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
