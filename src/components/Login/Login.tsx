import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import Loading from "../Loading/Loading";
import {jwtDecode} from "jwt-decode";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserContext(); // Context használata
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const decoded: any = jwtDecode(jwt);
        const currentTime = Date.now() / 1000; // Idő másodpercben
        if (decoded.exp > currentTime) {
          setIsLoggedIn(true);
          return;
        }
      } catch (err) {
        console.error("Érvénytelen JWT:", err);
      }
    }
    setIsLoggedIn(false);
    localStorage.removeItem("jwt"); // Érvénytelen token eltávolítása
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, [user]); // Figyeli a context változásait is

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
  
    const MIN_LOADING_TIME = 1800;
    const startTime = Date.now();
  
    try {
      // API hívás a bejelentkezéshez
      const response = await fetch("https://localhost:7197/api/Account/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt.result);
  
          const userResponse = await fetch("https://localhost:7197/api/User/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.jwt.result}`,
            },
          });
  
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData); // Felhasználói adatokat frissítjük
          } else {
            setUser("guest");
          }
  
          // navigate("/publish"); // Navigáció
        } else {
          setError("Nincs token a válaszban.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData || "Hiba történt a bejelentkezés során.");
      }
    } catch (err) {
      console.error("Hiba a bejelentkezés során:", err);
      setError("Hiba történt a bejelentkezés során.");
    } finally {
      const elapsedTime = Date.now() - startTime; // Eltelt idő
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
      console.log("remaning:", remainingTime);
      console.log("elapsed:", elapsedTime);
           
      // Várakozás a minimum idő biztosításához
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  };
  

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      {isLoggedIn ? (
        <p>Már be vagy jelentkezve!</p>
      ) : (
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
      )}
    </div>
  );
};

export default Login;
