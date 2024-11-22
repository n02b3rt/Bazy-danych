import "./ExportCSV.scss";

export default function ExportCSV({ users }) {
    const handleExport = () => {
        const csvContent = [
            ["Imię", "Nazwisko", "Adres", "PESEL", "Konto bankowe", "Pensja"],
            ...users.map(user => [
                user.name,
                user.surname,
                user.address,
                user.personal_id,
                user.bank_account,
                user.salary
            ])
        ]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "podsumowanie_platnosci.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button className="exportCSV" onClick={handleExport}>
            Eksportuj do CSV
        </button>
    );
}
