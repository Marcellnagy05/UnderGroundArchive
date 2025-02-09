const BASE_URL = "https://localhost:7197/api/Account";

export async function loginUser(login: string, password: string) {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ login, password }),
        });

        if (!response.ok) {
            throw new Error("Hibás felhasználónév vagy jelszó!");
        }

        const data = await response.json();
        if (!data.jwt?.result) {
            throw new Error("Nincs token a válaszban.");
        }

        localStorage.setItem("jwt", data.jwt.result);
        return data.jwt.result; // JWT visszaadása
    } catch (error) {
        console.error("Hiba a bejelentkezés során:", error);
        throw error;
    }
}

export async function fetchUserData(token: string) {
    try {
        const response = await fetch("https://localhost:7197/api/User/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Nem sikerült lekérni a felhasználói adatokat.");
        }

        return await response.json();
    } catch (error) {
        console.error("Hiba a felhasználói adatok lekérése során:", error);
        throw error;
    }
}

export function logoutUser() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("theme");
}

export async function registerUser(name: string, email: string, password: string, birthDate: string, country: string, phoneNumber: string) {
    const newUser = {
        Name: name,
        Email: email,
        Password: password,
        BirthDate: birthDate,
        Country: country,
        PhoneNumber: phoneNumber,
    };

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        });

        const contentType = response.headers.get("Content-Type");
        let responseData;

        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            const responseText = await response.text();
            console.error("Unexpected response:", responseText);
            throw new Error("Ismeretlen hiba történt a regisztráció során.");
        }

        if (!response.ok) {
            if (responseData.errorCode === "EMAIL_ALREADY_EXISTS") {
                throw new Error("Ez az email cím már regisztrálva van.");
            } else if (responseData.errorCode === "USERNAME_ALREADY_EXISTS") {
                throw new Error("Ez a felhasználónév már regisztrálva van.");
            } else if (responseData.errorCode === "REGISTRATION_FAILED") {
                throw new Error(`A regisztráció sikertelen: ${responseData.errors.join(", ")}`);
            } else {
                throw new Error("Ismeretlen hiba történt a regisztráció során.");
            }
        }

        return responseData.message;
    } catch (error: any) {
        console.error("Hiba a regisztráció során:", error);
        throw error;
    }
}
