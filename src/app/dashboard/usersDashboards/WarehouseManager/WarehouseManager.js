"use client";
import './WarehouseManager.scss'
import ShowOrders from "@/app/dashboard/components/features/ShowOrders/ShowOrders.js";


export default function WarehouseManager() {
    return (
        <section className="WarehouseManager">
            <ShowOrders/>
        </section>
    );
}
