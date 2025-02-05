import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import {jwtDecode} from "jwt-decode";
import { useThemeContext } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

export interface User {
  userId:string,
  userName: string,
  role: string,
  phoneNumber: string,
  country: string,
  email: string,
  birthDate: string,
  rankId: string,
  subscriptionId: string,

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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
        const userName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
        const role = decoded["http://schemas.xmlsoap.org/ws/2008/06/identity/claims/role"]
        const phoneNumber = decoded["PhoneNumber"]
        const country = decoded["Country"]
        const email = decoded["Email"]
        const birthDate = decoded["BirthDate"]
        const rankId = decoded["RankId"]
        const subscriptionId = decoded["SubscriptionId"]
        
        
        if (decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]) {
          setUser({ 
            userId: userId,
            userName: userName,
            role: role,
            phoneNumber: phoneNumber,
            country: country,
            email: email,
            birthDate: birthDate,
            rankId: rankId,
            subscriptionId: subscriptionId,
          });
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
    localStorage.removeItem("jwt");
    localStorage.removeItem("theme");
    setUser("guest");
    navigate("/")
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
