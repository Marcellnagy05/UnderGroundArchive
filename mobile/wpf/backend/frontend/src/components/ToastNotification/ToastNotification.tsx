import React, { useEffect, useState } from "react";
import "./ToastNotification.css";

interface ToastProps {
  message: string;
  onClose: () => void;
  type: "success" | "error";
}

const Toast: React.FC<ToastProps> = ({ message, onClose, type }) => {
    const [isFading, setIsFading] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsFading(true); // Fade-out osztály aktiválása
        setTimeout(onClose, 500); // Az onClose meghívása az animáció után
      }, 3000); // 3 másodpercig látható a toast
  
      return () => clearTimeout(timer); // Takarítás időzítő törlése
    }, [onClose]);
  
    return (
      <div className={`toast ${type} ${isFading ? "fade-out" : ""}`}>
        {message}
        <button onClick={onClose}>×</button>
      </div>
    );
  };

export default Toast;
