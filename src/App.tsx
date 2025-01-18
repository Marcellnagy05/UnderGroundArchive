import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import PublishBook from "./components/PublishBook/PublishBook";
import Home from "./components/Home/Home"
import Register from "./components/Register/Register";
import Books from "./components/Books/Books";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/publish" element={<PublishBook />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </Router>
  );
};

export default App;
