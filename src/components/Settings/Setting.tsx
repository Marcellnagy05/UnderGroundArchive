import { useState, useEffect } from "react";
import { useThemeContext } from "../contexts/ThemeContext";
import { FaList, FaBell, FaUserEdit, FaSun, FaMoon } from "react-icons/fa";
import RankSelector from "../RankSelector/RankSelector";
import "./Settings.css";

const Settings = ({ userProfile }) => {
  const { theme, setTheme } = useThemeContext();
  const [notifications, setNotifications] = useState<boolean>(true);
  const [selectedPictureId, setSelectedPictureId] = useState<number>(
    userProfile?.profilePictureId || 1
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      try {
        const response = await fetch(
          "https://localhost:7197/api/Account/updateTheme",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({ theme: newTheme }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(errorText);
          return;
        }

        const data = await response.json();
        console.log("Téma frissítve:", data);
      } catch (error) {
        console.log("Hiba történt:", error);
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
        <label className="switch">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className="slider">
            <FaSun
              className={`icon sun ${theme === "light" ? "active" : ""}`}
            />
            <FaMoon
              className={`icon moon ${theme === "dark" ? "active" : ""}`}
            />
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
      <div className="setting-item rank-selector">
        <div className="setting-icon">
          <FaList />
        </div>
        <div className="setting-content">
          <strong>Ikonválasztó</strong>
        </div>
          <RankSelector
            userProfile={userProfile}
            selectedPictureId={selectedPictureId}
            setSelectedPictureId={setSelectedPictureId}
          />
      </div>
    </div>
  );
};

export default Settings;
