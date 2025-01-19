import React, { createContext, useState, ReactNode, useContext } from "react";

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

  const logout = () => {
    localStorage.removeItem("jwt"); // JWT törlése
    setUser("guest"); // Felhasználó alapértelmezett állapotra állítása
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
