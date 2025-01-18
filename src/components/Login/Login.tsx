import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook a navigációhoz

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const userData = { login, password };
  
    try {
      const response = await fetch("https://localhost:7197/api/Account/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        // Ha sikeres a bejelentkezés, elmentjük a JWT tokent és átirányítunk
        const data = await response.json();
        console.log("Response Data: ", data); // Ellenőrizd, mi érkezik
  
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt.result); // Token tárolása a localStorage-ban
          navigate("/publish");
        } else {
          setError("Nincs token a válaszban.");
        }
      } else {
        // Hibakezelés
        const errorData = await response.json();
        setError(errorData || "Hiba történt a bejelentkezés során.");
      }
    } catch (err) {
      console.error("Hiba a bejelentkezés során:", err);
      setError("Hiba történt a bejelentkezés során.");
    }
  };
  

  return (
    <div>
      <h2>Bejelentkezés</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email vagy Felhasználónév:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Bejelentkezés</button>
      </form>
    </div>
  );
};

export default Login;
