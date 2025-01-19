import { useUserContext } from "../contexts/UserContext"; // Importáljuk a useUserContext hookot
import { useNavigate } from "react-router-dom";
import "./Logout.css"

const Logout = () => {
  const { setUser } = useUserContext(); // A setUser-t a kontextusból kapjuk
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Töröljük a JWT tokent
    setUser("guest"); // Frissítjük a felhasználót a "guest"-re
    navigate("/"); // Átirányítjuk a felhasználót a főoldalra
  };

  return (
    <button onClick={handleLogout} className="logoutBtn">
      Kijelentkezés
    </button>
  );
};

export default Logout;
