import { useThemeContext } from "../contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { updateTheme } from "../../services/UserServices";

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeContext();

    const toggleTheme = async () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        try {
            await updateTheme(newTheme);
            console.log("Téma frissítve:", newTheme);
        } catch (error) {
            console.log("Hiba történt a téma frissítése közben.");
        }
    };

    return (
        <div className="setting-item">
            <div className="setting-icon">{theme === "light" ? <FaSun /> : <FaMoon />}</div>
            <div className="setting-content">
                <strong>Téma</strong>
                <p>{theme === "light" ? "Világos" : "Sötét"}</p>
            </div>
            <label className="switch">
                <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
                <span className="themeSlider">
                    <FaSun className={`icon sun ${theme === "light" ? "active" : ""}`} />
                    <FaMoon className={`icon moon ${theme === "dark" ? "active" : ""}`} />
                </span>
            </label>
        </div>
    );
};

export default ThemeToggle;
