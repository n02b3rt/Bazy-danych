"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserData } from "@/lib/auth";

export default function UserProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        const redirectToUserProfile = async () => {
            try {
                const userData = await getUserData(); // Pobierz dane użytkownika
                router.push(`/dashboard/user-profile/${userData._id}`); // Przekieruj do strony użytkownika
            } catch (error) {
                console.error("Redirect failed:", error);
                router.push("/"); // Wróć do strony głównej w przypadku błędu
            }
        };

        redirectToUserProfile();
    }, [router]);

    return <p>Przekierowywanie do profilu...</p>;
}
