import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login/Login";
import PublishBook from "./components/PublishBook/PublishBook";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Books from "./components/Books/Books";
import Profile from "./components/Profile/Profile";
import Logout from "./components/Logout/Logout";
import { UserProvider } from "./components/contexts/UserContext"; // Importáljuk a UserProvider-t
import "./App.css";
import "../src/components/Profile/Profile.css";
import { useUserContext } from "./components/contexts/UserContext";
import { ToastProvider } from "./components/contexts/ToastContext";

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <UserProvider>
          <div className="appContent">
            <AppContent />
          </div>
        </UserProvider>
      </ToastProvider>
    </Router>
  );
};

const AppContent = () => {
  const { user } = useUserContext();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <div style={{ position: "relative" }}>
      <Profile /> {/* Profil megjelenítése a bal sarokban */}
      {user !== "guest" && (
        <>
          <Logout /> {/* Kijelentkezés gomb a jobb sarokban */}
        </>
      )}
      {!isHomePage && (
        <button
          onClick={() => {
            window.location.href = "/"; // Navigáció a Home oldalra
          }}
          className="home-button"
        >
          Home
        </button>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/publish" element={<PublishBook />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </div>
  );
};

export default App;
