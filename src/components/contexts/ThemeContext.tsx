import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { lightTheme, darkTheme } from "../../theme/theme"; // Importáld a színpalettát

interface ThemeContextType {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light", // Alapértelmezett téma
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Az alapértelmezett téma legyen "light", ha nincs elmentve érték
    const [theme, setTheme] = useState<"light" | "dark">(() => {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "light";
    });
  
    useEffect(() => {
      // Mentjük az aktuális témát a localStorage-ba
      localStorage.setItem("theme", theme);
  
      // Beállítjuk a CSS változókat a témának megfelelően
      const currentTheme = theme === "light" ? lightTheme : darkTheme;
      Object.keys(currentTheme).forEach((key) => {
        document.documentElement.style.setProperty(`--${key}`, currentTheme[key as keyof typeof currentTheme]);
      });
    }, [theme]);
  
    return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
  

export const useThemeContext = () => useContext(ThemeContext);
