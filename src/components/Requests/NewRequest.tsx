import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { newRequest } from "../../services/RequestService";

const NewRequest = () => {
  const [requestMessage, setRequestMessage] = useState("");
  const [requestType, setRequestType] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const options = [
    { value: "1", label: "Szerző", role: "Author" },
    { value: "2", label: "Kritikus", role: "Critic" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Nincs bejelentkezve!");
        return;
      }

      const responseMessage = await newRequest(
        requestMessage,
        requestType,
        token
      );
      setSuccessMessage(responseMessage);
      setRequestMessage("");
    } catch (err: any) {
      setError(err.message || "Hiba történt a kérés során.");
    } finally {
      setLoading(false);
    }
  };

  function getUserRole(): string | null {
    const token = localStorage.getItem("jwt");
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    } catch (error) {
      console.error("Hiba a token dekódolásakor:", error);
      return null;
    }
  }

  const userRole = getUserRole();
  console.log("Role:", userRole);

  const filteredOptions = options.filter((option) => option.role !== userRole);

  return (
    <div className="newRequestContainer">
      <h2>Új kérelem létrehozása</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Kérelem üzenete:</label>
          <textarea
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            required
          />
        </div>

        <div className="formGroup">
          <label>Kérelem típusa:</label>
          <select
            value={requestType}
            onChange={(e) => setRequestType(Number(e.target.value))}
          >
            {filteredOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="submitContainer">
          <button className="submitButton" type="submit" disabled={loading}>
            {loading ? "Küldés..." : "Kérelem beküldése"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRequest;
