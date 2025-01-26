import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import {
  FaAddressCard,
  FaLock,
  FaUpload,
  FaHome,
  FaBook,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="sidebar-content">
        <NavLink to="/" className="nav-item">
          <FaHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavLink>
        {user !== "guest" && (
          <>
            <NavLink to="/publish" className="nav-item">
              <FaUpload className="nav-icon" />
              <span className="nav-text">Publish</span>
            </NavLink>
            <NavLink to="/books" className="nav-item">
              <FaBook className="nav-icon" />
              <span className="nav-text">Books</span>
            </NavLink>
          </>
        )}
        {user === "guest" ? (
          <>
            <NavLink to="/login" className="nav-item">
              <FaLock className="nav-icon" />
              <span className="nav-text">Login</span>
            </NavLink>
            <NavLink to="/register" className="nav-item">
              <FaAddressCard className="nav-icon" />
              <span className="nav-text">Register</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile" className="nav-item">
              <FaUser className="nav-icon" />
              <span className="nav-text">Profile</span>
            </NavLink>
            <NavLink to="/settings" className="nav-item">
              <FaCog className="nav-icon" />
              <span className="nav-text">Settings</span>
            </NavLink>
            <NavLink to="/faq" className="nav-item">
              <FaQuestionCircle className="nav-icon" />
              <span className="nav-text">FAQ</span>
            </NavLink>
            <button onClick={handleLogout} className="nav-item logout">
              <FaSignOutAlt className="nav-icon" />
              <span className="nav-text">Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
