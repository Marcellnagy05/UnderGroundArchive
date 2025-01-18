import React, { createContext, useState, ReactNode, useContext } from "react";

// A felhasználói adatok típusa
interface User {
  userName: string;
}

// A Context típusa
interface UserContextType {
  user: User | string;
  setUser: React.Dispatch<React.SetStateAction<User | string>>;
}

// Alapértelmezett értékek
const defaultUserContext: UserContextType = {
  user: "guest",
  setUser: () => {}
};

// A Context létrehozása
export const UserContext = createContext<UserContextType>(defaultUserContext);

// Context Provider komponens
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | string>("guest");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook a context használatához
export const useUserContext = () => useContext(UserContext);
