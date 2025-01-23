import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import {jwtDecode} from "jwt-decode";
import { useThemeContext } from "../contexts/ThemeContext";

interface User {
  userName: string;
}

interface UserContextType {
  user: User | string;
  setUser: React.Dispatch<React.SetStateAction<User | string>>;
  logout: () => void;
}

const defaultUserContext: UserContextType = {
  user: "guest",
  setUser: () => {},
  logout: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | string>("guest");
  const { setTheme } = useThemeContext();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
  
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
  
        // Módosítjuk a userName helyett name-t keresve
        if (decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]) {
          setUser({ userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] });
        } else {
          console.error("Invalid token structure - missing name");
          logout();  // Ha nincs name, kijelentkeztetjük a felhasználót
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, []);
  

  const logout = () => {
    localStorage.removeItem("jwt"); // JWT törlése
    localStorage.removeItem("theme"); // Téma törlése
    setTheme("light")
    setUser("guest"); // Felhasználó alapértelmezett állapotra állítása
    window.location.reload();
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
