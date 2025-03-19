import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [clearChat, setClearChat] = useState(false);

    return (
        <ChatContext.Provider value={{ clearChat, setClearChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};
