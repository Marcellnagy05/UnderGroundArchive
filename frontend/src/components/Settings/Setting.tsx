import { useState } from "react";
import { FaBell, FaUserEdit } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import IconSelector from "../IconSelector/IconSelector";
import "./Settings.css";
import { UserProfile } from "../../Types/UserProfile";

interface SettingsProps {
  userProfile: UserProfile;
}

const Settings: React.FC<SettingsProps> = ({ userProfile }) => {
  const [notifications, setNotifications] = useState<boolean>(true);
  const [selectedPictureId, setSelectedPictureId] = useState<number>(parseInt(userProfile?.profilePictureId) || 1);

    const toggleNotifications = () => {
        setNotifications(!notifications);
    };

    return (
        <div className="settings-container">
            <h1>Beállítások</h1>
            <ThemeToggle />
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
            <IconSelector userProfile={userProfile} selectedPictureId={selectedPictureId} setSelectedPictureId={setSelectedPictureId} />
        </div>
    );
};

export default Settings;
