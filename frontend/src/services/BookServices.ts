const BASE_URL = "https://localhost:7197";

export async function getAllBooks() {
    try {
        const response = await fetch(`${BASE_URL}/api/Book/books`);
        return await response.json();
    } catch (error) {
        console.error("Hiba a könyvek lekérése során:", error);
        throw new Error("Hiba történt a könyvek betöltésekor.");
    }
}

export async function getBookCount() {
    try {
        const response = await fetch(`${BASE_URL}/api/Book/book/count`);
        return await response.json();
    } catch (error) {
        console.error("Hiba a könyvek számának lekérése során.");
        throw new Error("Hiba történt a könyvek számának lekérésekor.");
    }
}

export async function getBookById(id: number) {
    try {
        const response = await fetch(`${BASE_URL}/api/Book/book/${id}`)
        return await response.json();
    } catch (error) {
        console.error(`Hiba a ${id}-as/es indexű könyv lekérése során.`)
        throw new Error("Hiba történt a könyv lekérése során.")
    }
}


export async function getGenres() {
    try {
        const response = await fetch(`${BASE_URL}/api/Metadata/genres`);
        return await response.json();
    } catch (error) {
        console.error("Hiba a műfajok lekérése során:", error);
        throw new Error("Hiba történt a műfajok betöltésekor.");
    }
}

export async function getCategories() {
    try {
        const response = await fetch(`${BASE_URL}/api/Metadata/categories`);
        return await response.json();
    } catch (error) {
        console.error("Hiba a kategóriák lekérése során:", error);
        throw new Error("Hiba történt a kategóriák betöltésekor.");
    }
}

export async function getUserById(userId: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/user/${userId}`);
        return await response.json();
    } catch (error) {
        console.error("Hiba a felhasználó lekérése során:", error);
    }
}

export async function getCriticRatings(bookId: number) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/criticRatingsForBook/${bookId}`);
        return await response.json();
    } catch (error) {
        console.error("Hiba a kritikus értékelések lekérése során:", error);
    }
}

export async function getReaderRatings(userId: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/readerRatings?userId=${userId}`);

        // Ha a válasz státusza 404, akkor nincsenek értékelések
        if (response.status === 404) {
            return []; // Üres tömb visszaadása
        }

        if (!response.ok) {
            throw new Error(`Hiba az olvasói értékelések lekérése során: ${response.statusText}`);
        }

        return await response.json(); // JSON válasz feldolgozása
    } catch (error) {
        console.error("Hiba az olvasói értékelések lekérése során:", error);
        throw error;
    }
}

export async function saveRating(bookId: number, rating: number, userId: string, role: string, token: string) {
    const apiEndpoint = role !== "Critic"
        ? `${BASE_URL}/api/User/createReaderRating`
        : `${BASE_URL}/api/User/createCriticRating`;

    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ bookId, RatingValue: rating, RaterId: userId, role })
        });

        if (!response.ok && response.status !== 201) {
            const errorText = await response.text();
            throw new Error(`Hiba az értékelés mentése során: ${errorText}`);
        }

        if (response.status === 204) {
            return null;
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Hiba az értékelés mentése során:", error);
        throw error;
    }
}

export async function deleteRating(bookId: number, role: string, token: string) {
    const apiEndpoint = role !== "Critic"
        ? `${BASE_URL}/api/User/deleteReaderRating/${bookId}`
        : `${BASE_URL}/api/User/deleteCriticRating/${bookId}`;

    try {
        const response = await fetch(apiEndpoint, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hiba az értékelés törlése során: ${errorText}`);
        }

        if (response.status === 204) {
            return null;
        }

        const responseText = await response.text();
        return responseText.trim().length > 0 ? JSON.parse(responseText) : null;
    } catch (error) {
        console.error("Hiba az értékelés törlése során:", error);
        throw error;
    }
}

export async function addFavourite(bookId: number) {
    const token = localStorage.getItem("jwt")
    try {
        const response = await fetch(`${BASE_URL}/api/User/addFavourite/${bookId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ bookId }),
        });

        // Ellenőrzés, hogy van válasz
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Szerver hiba:", errorText);
            return null;  // Ha nincs érvényes válasz, null-t adunk vissza
        }

        // JSON válasz olvasása
        const jsonData = await response.json();
        console.log("Szerver válasz:", jsonData);
        return jsonData; // Visszaadjuk a válasz JSON-t

    } catch (error) {
        console.error("Hiba a kedvencek mentésekor:", error);
        return null;
    }
}

export async function deleteFavourite(bookId: number) {
    const token = localStorage.getItem("jwt")
    try {
        const response = await fetch(`${BASE_URL}/api/User/removeFavourite/${bookId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ bookId }),
        });

        // Ellenőrzés, hogy van válasz
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Szerver hiba:", errorText);
            return null;  // Ha nincs érvényes válasz, null-t adunk vissza
        }

        // JSON válasz olvasása
        const jsonData = await response.json();
        console.log("Szerver válasz:", jsonData);
        return jsonData; // Visszaadjuk a válasz JSON-t

    } catch (error) {
        console.error("Hiba a kedvencek mentésekor:", error);
        return null;
    }
}


export async function fetchFavourites(token: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/favourites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Nem sikerült lekérni a kedvenceket.");

        const data = await response.json();
        console.log("API válasz:", data); // Logoljuk a teljes választ
        // Ellenőrizzük, hogy a data valóban egy tömb-e és van-e benne bookId
        if (Array.isArray(data)) {
            return data.map((fav: { bookId: number }) => fav.bookId);
        } else {
            console.error("A válasz nem tömb!");
            return [];
        }
    } catch (error) {
        console.error("Hiba a kedvencek betöltésekor:", error);
        return [];
    }
}


export async function fetchMyFavourites(token: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/User/myfavourites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const favData = await response.json();

        return favData;

    } catch (error) {
        console.error("Hiba a kedvencek betöltésekor:", error);
        return [];
    }
} 