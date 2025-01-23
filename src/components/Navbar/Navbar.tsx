import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { FaUser, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink to="/" className="nav-link">
          <strong>Home</strong>
        </NavLink>
        {user !== "guest" && (
          <>
            <NavLink to="/publish" className="nav-link">
              <strong>Publish</strong>
            </NavLink>
            <NavLink to="/books" className="nav-link">
              <strong>Books</strong>
            </NavLink>
          </>
        )}
      </div>
      <div className="navbar-user">
        {user === "guest" ? (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
          </>
        ) : (
          <div className="user-dropdown" ref={dropdownRef}>
            <span className="user-name" onClick={toggleDropdown}>
              Hello, {typeof user === "string" ? user : user.userName} &#9662;
            </span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <NavLink to="/profile" className="dropdown-item">
                  <FaUser /> <strong>Profil</strong>
                </NavLink>
                <NavLink to="/settings" className="dropdown-item">
                  <FaCog /> <strong>Beállítások</strong>
                </NavLink>
                <NavLink to="/faq" className="dropdown-item">
                  <FaQuestionCircle /> <strong>FAQ</strong>
                </NavLink>
                <button onClick={handleLogout} className="dropdown-item">
                  <FaSignOutAlt /> <strong>Kijelentkezés</strong>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
