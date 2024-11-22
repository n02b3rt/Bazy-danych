import "./TotalSalary.scss";

export default function TotalSalary({ total }) {
    return (
        <div className="totalSalary">
            <h2>Łączna pensja do wypłaty:</h2>
            <p>{total.toLocaleString()} PLN</p>
        </div>
    );
}
