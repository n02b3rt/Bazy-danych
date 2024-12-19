"use client";

const ScannedLogs = ({ logs }) => {
    return (
        <div className="scanned-logs">
            <h3>Zeskanowane kody:</h3>
            {logs.length === 0 ? (
                <p>Brak zeskanowanych kodów.</p>
            ) : (
                <ul>
                    {logs.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ScannedLogs;
