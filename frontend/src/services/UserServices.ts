const BASE_URL = "https://localhost:7197/api/Account";

export async function updateTheme(newTheme: string) {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
        const response = await fetch(`${BASE_URL}/updateTheme`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({ theme: newTheme }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(errorText);
            throw new Error("Nem sikerült frissíteni a témát.");
        }

        return await response.json();
    } catch (error) {
        console.error("Hiba történt:", error);
        throw error;
    }
}
