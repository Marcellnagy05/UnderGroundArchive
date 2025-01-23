import { useState, useEffect } from "react";
import { useThemeContext } from "../contexts/ThemeContext"; // Importáljuk a ThemeContext-et
import { FaBell, FaUserEdit, FaSun, FaMoon } from "react-icons/fa";  // Nap és hold ikonok
import "./Settings.css"; // Importáljuk a CSS-t

const Settings = () => {
  const { theme, setTheme } = useThemeContext();
  const [notifications, setNotifications] = useState<boolean>(true);

  // A téma betöltése az oldal frissítésekor
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme); // Csak akkor állítjuk be, ha az érték "light" vagy "dark"
    }
  }, [setTheme]);

  const toggleTheme = async () => {
    // Frissítjük a helyi témát
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // API hívás, hogy a backend-en is frissüljön a téma
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const response = await fetch("https://localhost:7197/api/Account/updateTheme", {
          method: "PUT", // PUT metódus, mert frissítünk egy meglévő rekordot
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
          },
          body: JSON.stringify({ theme: newTheme }),
        });

        if (!response.ok) {
          // Ha nem sikerült a kérés, próbáljuk meg lekérni a válasz szöveget
          const errorText = await response.text();  // Próbáljuk meg szöveges választ is kezelni
          console.error("API hiba: ", errorText);
          alert("Hiba történt a téma frissítésekor.");
          return;
        }

        // Ellenőrizzük, hogy a válasz JSON típusú-e
        const data = await response.json();
        console.log("Téma frissítve:", data);
      } catch (error) {
        console.error("Hiba az API hívás során:", error);
      }
    }
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <div className="settings-container">
      <h1>Beállítások</h1>
      <div className="setting-item">
        <div className="setting-icon">
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </div>
        <div className="setting-content">
          <strong>Téma</strong>
          <p>{theme === "light" ? "Világos" : "Sötét"}</p>
        </div>
        {/* Switch a téma váltásához */}
        <label className="switch">
          {/* Hold és Nap ikonok a kapcsolóhoz */}
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className="slider">
            <FaSun className={`icon sun ${theme === "light" ? "active" : ""}`} />
            <FaMoon className={`icon moon ${theme === "dark" ? "active" : ""}`} />
          </span>
        </label>
      </div>
      <div className="setting-item">
        <div className="setting-icon">
          <FaUserEdit />
        </div>
        <div className="setting-content">
          <strong>Profil Módosítása</strong>
        </div>
        <button className="setting-button">Módosítás</button>
      </div>
      <div className="setting-item">
        <div className="setting-icon">
          <FaBell />
        </div>
        <div className="setting-content">
          <strong>Értesítések</strong>
          <p>{notifications ? "Be kapcsolva" : "Ki kapcsolva"}</p>
        </div>
        <button className="setting-button" onClick={toggleNotifications}>
          Váltás
        </button>
      </div>
    </div>
  );
};

export default Settings;
