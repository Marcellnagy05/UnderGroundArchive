const BASE_URL = "https://localhost:7197";

export async function getComments(bookId: number, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/comments/${bookId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await response.json();
    } catch (error) {
        console.error("Hiba a kommentek lekérése során:", error);
    }
}

export async function getUsername(userId: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/user/${userId}`);
        return await response.json();
    } catch (error) {
        console.error(`Hiba a felhasználónév lekérése során (${userId}):`, error);
    }
}

export async function createComment(bookId: number, commentMessage: string, userId: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/createComment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ bookId, commentMessage, commenterId: userId })
        });

        if (!response.ok) {
            throw new Error("Nem sikerült a komment létrehozása.");
        }
    } catch (error) {
        console.error("Hiba a komment létrehozása során:", error);
    }
}

export async function deleteComment(commentId: number, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/deleteComment/${commentId}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Nem sikerült a komment törlése.");
        }
    } catch (error) {
        console.error("Hiba a komment törlése során:", error);
    }
}
