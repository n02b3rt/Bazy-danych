"use client";

import React, { useState } from "react";
import './Button.scss';

const Button = ({ children, className = '' }) => {

    return (
        <button
            className={`button ${className}`}
        >
            {children} {/* Wyświetlanie tekstu przekazanego pomiędzy tagami Button */}
        </button>
    );
};

export default Button;
