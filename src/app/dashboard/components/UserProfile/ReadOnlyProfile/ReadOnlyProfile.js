"use client";

import ReadOnlyField from "../ReadOnlyField/ReadOnlyField";
import './ReadOnlyProfile.scss'

export default function ReadOnlyProfile({ formData, onEdit }) {
    return (
        <div className="readOnlyProfile">
            <div className="readOnlyProfile__data">
                {Object.keys(formData).map((key) => (
                    <ReadOnlyField
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={formData[key]}
                    />
                ))}
            </div>
            <button onClick={onEdit}>Edytuj dane</button>
        </div>
    );
}
