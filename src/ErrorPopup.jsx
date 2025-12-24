import { useState, useEffect } from "react";

let showPopupHandler;

export function ErrorPopup() {
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        showPopupHandler = (msg) => {
            setMessage(msg);
            setVisible(true);
            setTimeout(() => setVisible(false), 3000);
        };
    }, []);

    if (!visible) return null;

    return (
        <div style={popupStyles.overlay}>
            <div style={popupStyles.box}>
                <span style={popupStyles.icon}>⚠️</span>
                <p style={popupStyles.message}>{message}</p>
            </div>
        </div>
    );
}

export function showErrorPopup(message) {
    if (showPopupHandler) {
        showPopupHandler(message);
    } else {
        console.error("ErrorPopup is not mounted yet");
    }
}

const popupStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease",
    },
    box: {
        background: "#fef2f2",
        color: "#b91c1c",
        padding: "16px 24px",
        borderRadius: "10px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "500",
        maxWidth: "80%",
        animation: "scaleIn 0.3s ease",
    },
    icon: {
        fontSize: "20px",
    },
    message: {
        margin: 0,
    },
};
