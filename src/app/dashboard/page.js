"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/auth";
import Header from "@/components/Header/Header.js";
import WarehouseWorker from "@/app/dashboard/usersDashboards/WarehouseWorker/WarehouseWorker.js";
import WarehouseManager from "@/app/dashboard/usersDashboards/WarehouseManager/WarehouseManager.js";
import StoreManager from "@/app/dashboard/usersDashboards/StoreManager/StoreManager.js";
import UserProfile from "@/app/dashboard/components/UserProfile/UserProfile.js";
import './dashboard.scss';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [loggedInUserRole, setLoggedInUserRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserData();
                setUser(userData);
                setLoggedInUserRole(userData.role); // Ustawiamy rolę zalogowanego użytkownika
            } catch (err) {
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return <p>Ładowanie danych...</p>;
    }

    if (!user) {
        return null;
    }

    const handleShowProfile = () => setShowProfile(true);
    const handleHideProfile = () => setShowProfile(false);

    return (
        <div className="container">
            <Header
                email={user.email}
                role={user.role} // Przekazywanie roli do Header
                onEmailClick={handleShowProfile}
            />
            {showProfile ? (
                <UserProfile
                    user={user}
                    loggedInUserRole={loggedInUserRole} // Przekazywanie roli zalogowanego użytkownika
                    onBack={handleHideProfile}
                />
            ) : (
                <>
                    {user.role === "warehouse_manager" && <WarehouseManager />}
                    {user.role === "warehouse_worker" && <WarehouseWorker />}
                    {user.role === "store_manager" && <StoreManager />}
                </>
            )}
        </div>
    );
}
