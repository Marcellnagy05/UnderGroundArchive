import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import PublishBook from "./components/PublishBook/PublishBook";
import Register from "./components/Register/Register";
import Books from "./components/Books/Books";
import { UserProvider } from "./components/contexts/UserContext";
import { ToastProvider } from "./components/contexts/ToastContext";
import { ThemeProvider } from "./components/contexts/ThemeContext"; // Importáljuk a ThemeProvider-t
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import Settings from "./components/Settings/Setting";
import Profile from "./components/Profile/Profile";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ProfileProvider } from './components/contexts/ProfileContext';
import RaindropBackground from "./components/RaindropBackground/RaindropBackground";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./Home/Home";

const App = () => {
  const GOOGLE_CLIENT_ID = "500480770304-ll53e6gspf512sj82sotjmg36vcrqid7.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId= {GOOGLE_CLIENT_ID}>
    <Router>
      <ToastProvider>
        <UserProvider>
          <ThemeProvider>
            <ProfileProvider>
            <RaindropBackground />
            <div className="appContent">
              <Navbar />
              <SimpleBar style={{maxHeight: '100vh'}} className="main-content" autoHide={true}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/publish" element={<PublishBook />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </SimpleBar>
            </div>
            </ProfileProvider>
          </ThemeProvider>
        </UserProvider>
      </ToastProvider>
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
