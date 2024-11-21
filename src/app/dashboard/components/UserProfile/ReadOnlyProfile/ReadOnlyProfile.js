"use client";

import ReadOnlyField from "../ReadOnlyField/ReadOnlyField";

export default function ReadOnlyProfile({ formData, onEdit }) {
    return (
        <div>
            {Object.keys(formData).map((key) => (
                <ReadOnlyField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={formData[key]}
                />
            ))}
            <button onClick={onEdit}>Edytuj dane</button>
        </div>
    );
}
