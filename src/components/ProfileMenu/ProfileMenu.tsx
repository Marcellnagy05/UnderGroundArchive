import React, { useState } from "react";
import { FaQuestion,FaUser, FaLock, FaMoneyBill, FaStar, FaBook } from "react-icons/fa"; // Ikonok
import "./ProfileMenu.css";

interface ProfileMenuProps {
  onMenuClick: (tab: string) => void; // Függvény, amely egy stringet vár
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onMenuClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleToggleMenu = () => {
    if (menuOpen) {
      setIsClosing(true); // Indítsd el a bezáró animációt
      setTimeout(() => {
        setMenuOpen(false); // Ténylegesen zárd be a menüt
        setIsClosing(false); // Állítsd vissza az animáció állapotát
      }, 300); // Az animáció időtartamával megegyező idő (300ms)
    } else {
      setMenuOpen(true); // Nyisd ki a menüt
    }
  };

  return (
    <div className="menu-container">
      {/* 9 pont alapállapot */}
      {!menuOpen && (
        <div className="dots-menu" onClick={handleToggleMenu}>
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx}></div>
          ))}
        </div>
      )}

      {/* Nyitott menü: 3x3 grid */}
      {menuOpen && (
        <div
          className={`menu-items ${isClosing ? "closing" : "active"}`}
        >
          <button onClick={() => onMenuClick("adatok")}>
            <FaUser className="Icon" />
          </button>
          <button onClick={() => onMenuClick("jelszo")}>
            <FaLock className="Icon" />
          </button>
          <button onClick={() => onMenuClick("elofizetes")}>
            <FaMoneyBill className="Icon" />
          </button>
          <button onClick={() => onMenuClick("ertekelt")}>
            <FaStar className="Icon" />
          </button>
          {/* Középső "X" gomb */}
          <button className="close-menu" onClick={handleToggleMenu}>
            ✕
          </button>
          <button onClick={() => onMenuClick("konyveim")}>
            <FaBook />
          </button>

          <button><FaQuestion/></button>
          <button><FaQuestion/></button>
          <button><FaQuestion/></button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
