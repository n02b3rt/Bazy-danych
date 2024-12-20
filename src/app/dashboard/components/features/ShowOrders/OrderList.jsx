// src/app/dashboard/components/OrderList.js

import React from "react";
import OrderItem from "./OrderItem.jsx";

const OrderList = ({ filteredOrders, toggleOrderDetails }) => {
    return (
        <ul className="order-list">
            {filteredOrders.map((order) => (
                <OrderItem
                    key={order._id}
                    order={order}
                    toggleOrderDetails={toggleOrderDetails}
                />
            ))}
        </ul>
    );
};

export default OrderList;
