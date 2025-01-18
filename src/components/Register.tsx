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
    
      const responseText = await response.text();
      console.log("Raw response:", responseText);
    
      if (response.ok) {
        const data = JSON.parse(responseText); // Parse the successful response
        console.log("Sikeres regisztráció:", data.message);
        setError(""); // Clear error
      } else {
        const errorData = JSON.parse(responseText); // Parse error response
        console.error("Hiba:", errorData);
    
        // Specifikus hibaüzenetek kezelése
        if (errorData.errorCode === "MISSING_FIELDS") {
          setError("Kérjük, töltsön ki minden mezőt.");
        } else if (errorData.errorCode === "EMAIL_ALREADY_EXISTS") {
          setError("Ez az email cím már regisztrálva van.");
        } else if (errorData.errorCode === "USERNAME_ALREADY_EXISTS") {
          setError("Ez a felhasználónév már regisztrálva van.");
        } else if (errorData.errorCode === "REGISTRATION_FAILED") {
          setError(`A regisztráció sikertelen: ${errorData.errors.join(", ")}`);
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
    <div>
      <h2>Regisztráció</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Név:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Jelszó:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Születési dátum:</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ország:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Telefonszám:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
};

export default Register;
