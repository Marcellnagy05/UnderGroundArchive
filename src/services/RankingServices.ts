const BASE_URL = "https://localhost:7197";

export async function updatePoints(userId: string, points: number, role: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/Ranking/updatePoints`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt") || ""}`,
            },
            body: JSON.stringify({ userId, points, role }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hiba a pontok frissítése során: ${errorText}`);
        }

        const responseText = await response.text();

        return responseText || null;
    } catch (error) {
        console.error("Hiba a pontok frissítése során:", error);
        throw error;
    }
}

export async function reportUser(userId: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/Ranking/reportUser`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error("Hiba a felhasználó büntetése során!");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}