"use client";
import './MonthlySummary.scss'

const MonthlySummary = ({ totalRevenue, totalExpenses }) => {
    return (
        <div className="monthly-summary">
            <h1>Podsumowanie magazynu</h1>
            <h3>Podsumowanie miesięczne</h3>
            <p>Całkowite zarobki: <span className="monthly-summary__totalRevenue">{totalRevenue.toFixed(2)} PLN</span></p>
            <p>Całkowite wydatki: <span className="monthly-summary__totalExpenses">{totalExpenses.toFixed(2)} PLN</span>
            </p>
        </div>
);
};

export default MonthlySummary;
