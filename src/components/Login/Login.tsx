import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // Importáljuk a useUserContext hookot
import Loading from "../Loading/Loading"; // A betöltő képernyő komponens

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Betöltés állapota
  const navigate = useNavigate(); // Hook a navigációhoz
  const { setUser } = useUserContext(); // A setUser-t a UserContext-ból kapjuk
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (localStorage.getItem("jwt")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true); // Betöltő képernyő mutatása

    const MIN_LOADING_TIME = 5000; // 5 másodperc minimum betöltési idő
    const startTime = Date.now(); // Kezdő időpont mentése

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
        const data = await response.json();
        console.log("Response Data: ", data);

        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt.result);

          const userResponse = await fetch(
            "https://localhost:7197/api/User/me",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${data.jwt.result}`,
              },
            }
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else {
            setUser("guest");
          }
          navigate("/publish");
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
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      setTimeout(() => {
        setIsLoading(false); // Betöltő képernyő elrejtése
      }, remainingTime); // Maradék idő biztosítása
    }
  };

  if (isLoading) {
    return <Loading />; // Betöltő képernyő mutatása
  }

  return (
    <div>
      {isLoggedIn ? (
        <p>Már Be vagy jelentkezve</p>
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
