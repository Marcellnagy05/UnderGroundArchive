import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./components/Login/Login";
import PublishBook from "./components/PublishBook/PublishBook";
import Register from "./components/Register/Register";
import Books from "./components/Books/Books";
import { UserProvider } from "./components/contexts/UserContext";
import { ToastProvider } from "./components/contexts/ToastContext";
import { ThemeProvider } from "./components/contexts/ThemeContext";  // Importáljuk a ThemeProvider-t
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import Settings from "./components/Settings/Setting";
import Profile from "./components/Profile/Profile";

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <UserProvider>
          <ThemeProvider>
            <div className="appContent">
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/publish" element={<PublishBook />} />
                <Route path="/books" element={<Books />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </ThemeProvider>
        </UserProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
