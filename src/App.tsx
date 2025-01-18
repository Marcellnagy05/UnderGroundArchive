import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import PublishBook from "./components/PublishBook/PublishBook";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Books from "./components/Books/Books";
import Profile from "./components/Profile/Profile";
import Logout from "./components/Logout/Logout";
import { UserProvider } from "./components/context/UserContext"; // Importáljuk a UserProvider-t
import "./App.css";
import "../src/components/Profile/Profile.css";
import { useUserContext } from "./components/context/UserContext";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <div className="appContent">
          <AppContent/>
        </div>
      </UserProvider>
    </Router>
  );
};

const AppContent = () =>{
  const { user } = useUserContext();

  return(
    <div style={{ position: "relative" }}>
    <Profile /> {/* Profil megjelenítése a bal sarokban */}
    {user !== "guest" && (
      <>
        <Logout /> {/* Kijelentkezés gomb a jobb sarokban */}
      </>
    )}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/publish" element={<PublishBook />} />
      <Route path="/books" element={<Books />} />
    </Routes>
  </div>
  )
}

export default App;
