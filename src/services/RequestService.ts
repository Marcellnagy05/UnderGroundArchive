const BASE_URL = "https://localhost:7197/api";

export async function getMyRequests (token: string){
    try {
        const response = await fetch(`${BASE_URL}/User/myrequests`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return await response.json();
    } catch (error) {
        console.error("Hiba a kérelmek lekérése során:", error);
        throw new Error("Hiba történt a kérelmek betöltésekor.");
    }
}

export async function newRequest(requestMessage: string, requestType: number, token: string) {
    const newRequest = {
        RequestMessage: requestMessage,
        RequestType: requestType
    };

    console.log("Küldött token:", token);
    console.log("Küldött adatok:", newRequest);

    const response = await fetch(`${BASE_URL}/User/createRequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newRequest)
    });

    console.log("Válasz státusz:", response.status); 

    if (response.status === 401) {
        throw new Error("Nincs jogosultság. Lehet, hogy a token érvénytelen vagy lejárt.");
    }

    if (!response.ok) {
        throw new Error(`Hiba történt: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
    } else {
        const responseText = await response.text();
        console.error("Unexpected response:", responseText);
        throw new Error("Ismeretlen hiba történt a kérelem létrehozása során.");
    }

    console.log("Válasz adatok:", responseData); // Debug

    return responseData.message;
}
