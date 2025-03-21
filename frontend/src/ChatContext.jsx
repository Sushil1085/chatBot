import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [clearChat, setClearChat] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");

    useEffect(() => {
        localStorage.setItem("username", username);
    }, [username]);

    const logout = () => {
        setUsername("");  // Clear username from state
        localStorage.removeItem("username"); // Remove username from localStorage
    };

    return (
        <ChatContext.Provider value={{ clearChat, setClearChat, username, setUsername, logout }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};
