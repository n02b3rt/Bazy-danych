"use client";

import React from "react";
import './Button.scss';

const Button = ({ children, className = '', onClick }) => {
    return (
        <button
            className={`button ${className}`}
            onClick={onClick}  // Wywołujemy funkcję onClick, jeśli jest przekazana
        >
            {children} {/* Wyświetlanie tekstu przekazanego pomiędzy tagami Button */}
        </button>
    );
};

export default Button;
