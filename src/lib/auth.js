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
    const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Wysyłanie ciasteczek
    });

    if (!response.ok) {
        throw new Error("Unauthorized");
    }

    return response.json(); // Zwraca dane użytkownika, jeśli token jest prawidłowy
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
