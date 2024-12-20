"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import './RevenueChart.scss'

// Rejestrujemy elementy, które będziemy używać w wykresie
ChartJS.register(ArcElement, Tooltip, Legend);

const RevenueChart = ({ totalRevenue, totalExpenses }) => {
    const chartData = {
        labels: ["Zarobki", "Wydatki"],
        datasets: [
            {
                data: [totalRevenue, totalExpenses],
                backgroundColor: ["#36A2EB", "#FF5733"],
                hoverBackgroundColor: ["#36A2EB", "#FF5733"]
            }
        ]
    };

    return (
        <div className="revenue-chart">
            <h3>Wykres przychodów i wydatków</h3>
            <Pie data={chartData} className="revenue-chart" />
        </div>
    );
};

export default RevenueChart;
