const fetchInterceptor = async (input: RequestInfo, init?: RequestInit) => {
    // Modify request before sending
    const token = localStorage.getItem("jwt");
    const modifiedInit: RequestInit = {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(input, modifiedInit);
        
        if (!response.ok) {
            if (response.status === 401) {
                console.error("Unauthorized - Redirecting to login");
            }
        }
        
        return response;
    } catch (error) {
        console.error("Fetch error: ", error);
        throw error;
    }
};

export default fetchInterceptor;
