import { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext"; // Importáljuk a useUserContext hookot

const Profile = () => {
  const { user, setUser } = useUserContext(); // A felhasználói adatokat és setUser-t a kontextusból kapjuk

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt");

      if (token) {
        try {
          const response = await fetch("https://localhost:7197/api/User/me", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Frissítjük a felhasználót
          } else {
            setUser("guest"); // Ha nem található felhasználó, akkor guest lesz
          }
        } catch (err) {
          console.error("Hiba a felhasználói adatok betöltésekor:", err);
          setUser("guest"); // Ha hiba történik, akkor guest lesz
        }
      } else {
        setUser("guest"); // Ha nincs token, akkor guest lesz
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <div className="profileContainer">
      {typeof user === "string" ? <p>{user}</p> : <p>{user.userName}</p>}
    </div>
  );
};

export default Profile;
