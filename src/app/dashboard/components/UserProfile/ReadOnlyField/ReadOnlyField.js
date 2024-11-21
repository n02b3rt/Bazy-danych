"use client";

export default function ReadOnlyField({ label, value }) {
    return (
        <p>
            <strong>{label}:</strong> {value || "Brak danych"}
        </p>
    );
}
