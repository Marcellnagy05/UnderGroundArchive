import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout/Logout";

const Home = () => {
  const navigate = useNavigate();
  const [navigationPath, setNavigationPath] = useState<string>()

  const NavigationRouter = (path: string) =>{
    setNavigationPath(path)
    navigate(path)
  }
  return (
  <div>
    <button onClick={() => NavigationRouter("/login")}>Login</button>
    <button onClick={() => NavigationRouter("/register")}>Register</button>
    <button onClick={() => NavigationRouter("/books")}>Books</button>
  </div>
  )
};

export default Home;
