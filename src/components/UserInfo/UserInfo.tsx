import { FaEnvelope, FaGlobe, FaPhone, FaBirthdayCake } from "react-icons/fa";
import "./UserInfo.css"

interface UserInfoProps{
    email: string,
    birthDate: string,
    country: string,
    phone: string
}

export const UserInfo: React.FC<UserInfoProps> = ({ email, birthDate, country, phone }) => {
  return (
    <div className="user-info-icons">
      <div className="icon-container">
        <FaEnvelope className="icon" />
        <span className="tooltip">{email || "N/A"}</span>
      </div>
      <div className="icon-container">
        <FaBirthdayCake className="icon" />
        <span className="tooltip">{birthDate || "N/A"}</span>
      </div>
      <div className="icon-container">
        <FaGlobe className="icon" />
        <span className="tooltip">{country || "Unknown"}</span>
      </div>
      <div className="icon-container">
        <FaPhone className="icon" />
        <span className="tooltip">{phone || "N/A"}</span>
      </div>
    </div>
  );
};
