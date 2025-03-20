import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [clearChat, setClearChat] = useState(false);
    const [username, setUsername] = useState('');

    return (
        <ChatContext.Provider value={{ clearChat, setClearChat, username, setUsername }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};
