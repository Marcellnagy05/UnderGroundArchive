import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!name || !email || !password || !birthDate || !country || !phoneNumber) {
      setError("Minden mezőt ki kell tölteni.");
      return;
    }
  
    const newUser = {
      Name: name,
      Email: email,
      Password: password,
      BirthDate: birthDate,
      Country: country,
      PhoneNumber: phoneNumber,
    };
  
    try {
      const response = await fetch("https://localhost:7197/api/Account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
  
      // Check if the response is a valid JSON (application/json)
      const contentType = response.headers.get("Content-Type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        // Handle unexpected response types (like HTML or plain text)
        const responseText = await response.text();
        console.error("Unexpected response:", responseText);
        setError("Ismeretlen hiba történt a regisztráció során.");
        return;
      }
  
      if (response.ok) {
        console.log("Sikeres regisztráció:", responseData.message);
        setError(""); // Clear error
      } else {
        console.error("Hiba:", responseData);
        
        // Specifikus hibaüzenetek kezelése
        if (responseData.errorCode === "MISSING_FIELDS") {
          setError("Kérjük, töltsön ki minden mezőt.");
        } else if (responseData.errorCode === "EMAIL_ALREADY_EXISTS") {
          setError("Ez az email cím már regisztrálva van.");
        } else if (responseData.errorCode === "USERNAME_ALREADY_EXISTS") {
          setError("Ez a felhasználónév már regisztrálva van.");
        } else if (responseData.errorCode === "REGISTRATION_FAILED") {
          setError(`A regisztráció sikertelen: ${responseData.errors.join(", ")}`);
        } else {
          setError("Ismeretlen hiba történt a regisztráció során.");
        }
      }
    } catch (err) {
      console.error("Hiba a regisztráció során:", err);
      setError("Hiba történt a regisztráció során.");
    }    
  };
  

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
      <h2 className="register-title">Regisztráció</h2>
        <div className="register-input-group">
          <label className="register-label">Név:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="register-input"
            required
          />
        </div>
        <div className="register-input-group">
          <label className="register-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
            required
          />
        </div>
        <div className="register-input-group">
          <label className="register-label">Jelszó:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
            required
          />
        </div>
        <div className="register-input-group">
          <label className="register-label">Születési dátum:</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="register-input"
            required
          />
        </div>
        <div className="register-input-group">
          <label className="register-label">Ország:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="register-input"
            required
          />
        </div>
        <div className="register-input-group">
          <label className="register-label">Telefonszám:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="register-input"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="register-button">Regisztráció</button>
      </form>
    </div>
  );
};

export default Register;
