import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  </div>
  )
};

export default Home;
