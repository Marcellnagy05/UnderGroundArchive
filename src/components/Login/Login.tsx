import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import Loading from "../Loading/Loading";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../contexts/ToastContext";
import { useThemeContext } from "../contexts/ThemeContext";
import "./Login.css"

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserContext(); // Context használata
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {showToast} = useToast();
  const { setTheme } = useThemeContext();

  const checkIfLoggedIn = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const decoded: any = jwtDecode(jwt);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setIsLoggedIn(true);
          return;
        }
      } catch (err) {
        console.error("Érvénytelen JWT:", err);
      }
    }
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, [user]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
  
    const MIN_LOADING_TIME = 2500;
    const startTime = Date.now();
  
    try {
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
  
          // Betöltjük a felhasználó választott témáját (ha van)
          const userResponse = await fetch("https://localhost:7197/api/User/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.jwt.result}`,
            },
          });
  
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
  
            // Téma lekérése a user adatokból és beállítása
            if (userData.theme) {
              localStorage.setItem("theme", userData.theme); // Téma tárolása
              setTheme(userData.theme as "light" | "dark");  // Téma alkalmazása
            }
          } else {
            setUser("guest");
          }
        } else {
          showToast("Nincs token a válaszban.", "error");
        }
      } else {
        const errorData = await response.json();
        showToast("Hibás felhasználónév vagy jelszó!", "error");
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("Hiba a bejelentkezés során:", err);
      showToast("Hiba történt a bejelentkezés során.", "error");
      setIsLoading(false);
      return;
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
  
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  };
  
  

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <p className="logged-in-message">Már be vagy jelentkezve!</p>
      ) : (
        <div className="login-form">
          <h2>Bejelentkezés</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email vagy Felhasználónév:</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Jelszó:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Bejelentkezés</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;