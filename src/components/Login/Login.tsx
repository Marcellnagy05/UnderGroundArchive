import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import Loading from "../Loading/Loading";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../contexts/ToastContext";
import { useThemeContext } from "../contexts/ThemeContext";
import GoogleLoginButton from "../GoogleLoginButton/GoogleLoginButton";
import { loginUser, fetchUserData } from "../../services/AuthServices"; // Importált service
import "./Login.css";

const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useUserContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { showToast } = useToast();
    const { setTheme } = useThemeContext();

    const checkIfLoggedIn = () => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            try {
                const decoded: any = jwtDecode(jwt);
                if (decoded.exp > Date.now() / 1000) {
                    setIsLoggedIn(true);
                    return;
                }
            } catch (err) {
                console.error("Érvénytelen JWT:", err);
            }
        }
        setIsLoggedIn(false);
        localStorage.removeItem("jwt");
    };

    useEffect(() => {
        checkIfLoggedIn();
    }, [user]);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const token = await loginUser(login, password); // API hívás
            const userData = await fetchUserData(token);
            
            setUser(userData);

            if (userData.theme) {
                localStorage.setItem("theme", userData.theme);
                setTheme(userData.theme as "light" | "dark");
            }

            showToast("Sikeres bejelentkezés!", "success");
        } catch (error: any) {
            showToast(error.message || "Hiba történt a bejelentkezés során.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="login-container">
            {isLoggedIn ? (
                <p className="logged-in-message">Már be vagy jelentkezve!</p>
            ) : (
                <div className="login-form">
                    <h2>Bejelentkezés</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email vagy Felhasználónév:</label>
                            <input
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Jelszó:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Bejelentkezés</button>
                    </form>
                    <GoogleLoginButton />
                </div>
            )}
        </div>
    );
};

export default Login;
