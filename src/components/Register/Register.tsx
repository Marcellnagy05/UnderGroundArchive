import React, { useState } from "react";
import { registerUser } from "../../services/AuthServices";
import { useToast } from "../contexts/ToastContext";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [country, setCountry] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name || !email || !password || !birthDate || !country || !phoneNumber) {
            setError("Minden mezőt ki kell tölteni.");
            return;
        }

        try {
            const message = await registerUser(name, email, password, birthDate, country, phoneNumber);
            showToast(message, "success");
            navigate("/login")
            setError("");
        } catch (error: any) {
            setError(error.message || "Hiba történt a regisztráció során.");
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2 className="register-title">Regisztráció</h2>
                <div className="register-input-group">
                    <label className="register-label">Név:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="register-input" required />
                </div>
                <div className="register-input-group">
                    <label className="register-label">Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="register-input" required />
                </div>
                <div className="register-input-group">
                    <label className="register-label">Jelszó:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="register-input" required />
                </div>
                <div className="register-input-group">
                    <label className="register-label">Születési dátum:</label>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="register-input" required />
                </div>
                <div className="register-input-group">
                    <label className="register-label">Ország:</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="register-input" required />
                </div>
                <div className="register-input-group">
                    <label className="register-label">Telefonszám:</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="register-input" required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="register-button">Regisztráció</button>
            </form>
        </div>
    );
};

export default Register;
