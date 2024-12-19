"use client";

export default function EditableField({ label, name, value, onChange, error, type = "text" }) {
    const handleInputChange = (e) => {
        onChange(e);
    };

    return (
        <label>
            <strong>{label}:</strong>
            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={handleInputChange}
            />
            {error && <p className="error">{error}</p>}
        </label>
    );
}
