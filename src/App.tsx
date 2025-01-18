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

const App = () => {
  return (
    <Router>
      <UserProvider> {/* A UserProvider köré rendezzük az alkalmazást */}
        <div style={{ position: "relative" }}>
          <Profile /> {/* Profil megjelenítése a bal sarokban */}
          <Logout /> {/* Kijelentkezés gomb a jobb sarokban */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/publish" element={<PublishBook />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;
