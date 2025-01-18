import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate(); // Hook a navigációhoz

    function logout() {
        // Token törlése a localStorage-ból vagy sessionStorage-ból
        localStorage.removeItem('jwt');
        sessionStorage.removeItem('jwt');
    
        // Navigáció a login oldalra
        navigate("/");
    }
  return (
    <button onClick={logout}>Kijelentkezes</button>
  )
}

export default Logout