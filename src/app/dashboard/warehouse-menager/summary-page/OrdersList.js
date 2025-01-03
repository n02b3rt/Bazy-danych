"use client";

import './OrdersList.scss';

const OrdersList = ({ orders, calculateProfitLoss }) => {
    return (
        <div className="orders-list">
            <ul>
                {orders.map((order) => {
                    const profitLoss = calculateProfitLoss(order);
                    return (
                        <li key={order._id}>
                            <div className="order-details">
                                <p><strong>ID:</strong> {order._id}</p>
                                <p>{new Date(order.order_date).toLocaleDateString()}</p>
                                <p>{order.warehouse_status}</p>
                                <p>{order.completed_status}</p>
                                <div className="profit-loss" style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>
                                    <strong>{profitLoss >= 0 ? 'Zysk' : 'Strata'}:</strong> {profitLoss >= 0 ? Math.abs(profitLoss).toFixed(2) : Math.abs(profitLoss * 0.77).toFixed(2) } PLN
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default OrdersList;
