// Funkcja do logowania
export async function loginUser(email, password) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to log in");
    }

    return response.json(); // Zwraca dane, jeśli logowanie się udało
}

// Funkcja do pobierania danych użytkownika
export async function getUserData() {
    try {
        const response = await fetch("/api/auth/verify", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Wysyłanie ciasteczek
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(errorData.error || "Unauthorized");
        }

        const userData = await response.json();
        console.log("Fetched user data:", userData); // Debugowanie danych
        return userData; // Zwraca dane użytkownika
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}


// Funkcja do wylogowywania
export async function logoutUser() {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Wysyłanie ciasteczek
    });

    if (!response.ok) {
        throw new Error("Logout failed");
    }

    return true;
}
