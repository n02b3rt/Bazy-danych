import { useEffect } from "react";
import "./Alert.scss";

export default function Alert({ message, onClose, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer); // Wyczyść timer, jeśli komponent zostanie usunięty wcześniej
    }, [onClose, duration]);

    return (
        <div className="alert">
            <p>{message}</p>
            <button onClick={onClose} className="alert__close">✖</button>
        </div>
    );
}
