import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Card, CardHeader, Center, Flex, Grid, GridItem, Heading, Icon, Radio, RadioGroup, Stack, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import { useChat } from "../ChatContext";
import { VscSend } from "react-icons/vsc";

const MainPage = () => {
    const [value, setValue] = useState("");
    const [allchats, setAllchats] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const { clearChat, setClearChat } = useChat();
    const { username } = useChat();
    const bottomRef = useRef(null);

    const navigate = useNavigate();

    let { id } = useParams();
    const { userid } = useParams();

    console.log("id:", id, "Type:", typeof id);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userMessage = { data: value, sender: "user" };
        const loadingMessage = { data: <div className="loader"></div>, sender: "chatbot" };

        setAllchats((prevchats) => [...prevchats, userMessage, loadingMessage]);

        if (id) {
            sendResponse(value, "user");
        }
        setValue("");

        try {
            const res = await axios.get(`http://216.10.251.154:5000/ask?question=${value}`);


            setAllchats((prevchats) => [
                ...prevchats.slice(0, -1),
                { data: res.data.response || "No response received", sender: "chatbot" }
            ]);

            if (id) {
                // console.log("from id is present");

                sendResponse(res?.data?.response, "chatbot");
            } else {
                // console.log("from id is Absent");
                const data = {
                    userMessage: userMessage,
                    resposne: { data: res.data.response || "No response received", sender: "chatbot" }
                }
                sendNewChat(data)
            }

        } catch (error) {
            console.error("Error fetching response", error);
            setAllchats((prevchats) => [
                ...prevchats.slice(0, -1),
                { data: "I am not able to find", sender: "chatbot" }
            ]);
            sendResponse(error, "chatbot");
        }
    };

    useEffect(() => {

        if (id) {
            getsidebardata(id);
        }
        if (clearChat === true) {
            setAllchats([]);
            setClearChat(false);
        }
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);

    }, [allchats, clearChat, id, setClearChat]);

    console.log(allchats);


    const sendResponse = async (message, sender) => {
        try {
            await axios.post('http://localhost:5000/chat-body', {
                message: message,
                sender: sender,
                title_id: id
            })
        } catch (error) {
            console.error("Error saving message:", error);
        }
    }

    const sendNewChat = async (allchats) => {

        try {
            const response = await axios.post(`http://localhost:5000/newChat/${userid}`, {
                allchats
            })
            // console.log(response.data.chat_id,"chat_id");

            navigate(`/${userid}/${response.data.chat_id}`);

        } catch (error) {
            console.error("Error saving message:", error);
        }
    }

    const getsidebardata = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/getsidebardata/${userid}/${id}`);
            // console.log(response.data,"setChatHistory");
            setChatHistory(response.data)
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }

    // const text = "This is *bold text* and this is normal text.";

    // const parts = text.split(/(\*.*?\*)/g);

    return (

        <Flex h="100vh" bgColor="#1A202C" flexDir="column" justifyContent="space-between" alignItems={'center'} gap={4} >
            <Flex bg={'#171923'} h={'90px'} w={'100%'} >
                <Flex bg={'#171923'} w={'100%'} justifyContent={'flex-end'} alignItems={'center'}>
                    <Avatar size={'sm'} mr={'10px'} src='https://bit.ly/broken-link' /><Text color={'white'} mr={'20px'}> {username}</Text>
                </Flex>
            </Flex>
            {/* <Text color="white">
                {parts.map((part, index) =>
                    part.startsWith("*") && part.endsWith("*") ? (
                        <Text as="span" key={index} fontWeight="bold">
                            {part.slice(1, -1)}
                        </Text>
                    ) : (
                        <Text as="span" key={index}>
                            {part}
                        </Text>
                    )
                )}
            </Text> */}




            <Button
                onClick={() => { navigate(`/${userid}`); setAllchats([]) }}
                alignSelf={'flex-start'} colorScheme='#1A202C'><AddIcon mr={'7px'} /> New Chat
            </Button>

            <Flex
                bg={"#1A202C"}
                h={"100%"}
                flexDir={"column"}
                overflowY={"auto"}

                w={"70%"}
                p={4}
                sx={{
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#2D3748",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#4A5568",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background: "#718096",
                    },
                }}
            >
                {id  ?  (
                    chatHistory.map((chat, index) => (
                        <Box
                            key={index}
                            alignSelf={chat.sender === "chatbot" ? "flex-start" : "flex-end"}
                            bg={chat.sender === "chatbot" ? "#2D3748" : "#4A90E2"}
                            color="white"
                            borderRadius="20px"
                            p="10px"
                            maxW="60%"
                            my="8px"
                            boxShadow="md"
                        >
                            {chat.sender === "chatbot" && index === chatHistory.length - 1 ? (
                                <TypeAnimation
                                    sequence={[chat.message]}
                                    wrapper="span"
                                    speed={70}
                                    cursor={false}
                                    style={{ display: "inline-block" }}
                                />
                            ) : (
                                <Text>{chat.message}</Text>
                            )}
                            <div ref={bottomRef}></div>

                        </Box>
                    ))
                ) : (
                    allchats.map((chat, index) => (
                        <Box
                            key={index}
                            alignSelf={chat.sender === "chatbot" ? "flex-start" : "flex-end"}
                            bg={chat.sender === "chatbot" ? "#2D3748" : "#4A90E2"}
                            color="white"
                            borderRadius="20px"
                            p="10px"
                            maxW="60%"
                            my="8px"
                            boxShadow="md"
                        >

                            {chat.sender === "chatbot" && index === allchats.length - 1 ? (
                                <TypeAnimation
                                    sequence={[chat.message]}
                                    wrapper="span"
                                    speed={70}
                                    cursor={false}
                                    style={{ display: "inline-block" }}
                                />
                            ) : (
                                <Text>{chat.message}</Text>
                            )}

                        </Box>
                    ))
                )}

                {/* {id === undefined ? (
                    <Text color={"white"}> undefined................................. </Text>
                ) : (
                    <Text color={"white"}> not................................. </Text>
                )} */}



            </Flex>

            <Flex bg={'#2D3748'} color={'white'} h={'150px'} w={'70%'} borderRadius="20px" mb="15px" zIndex="20" flexDirection="column-reverse" >
                <Flex justifyContent="flex-end">
                    {value.length > 0 ? <Button w="40px" h="40px" color={"white"} bg="#171923" borderRadius="100%" m="5px"
                        _hover={{ bg: "#4A90E2" }}
                        onClick={handleSubmit}>

                        <Icon as={VscSend} boxSize={4} />

                    </Button> : " "}

                </Flex>
                <Textarea
                    placeholder="Ask Anything"
                    size="sm"
                    border={"none"}
                    resize="vertical"
                    borderRadius="20px"
                    _focus={{ outline: "none", boxShadow: "none", borderColor: "transparent" }}
                    overflowY="auto"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            if (value.trim() !== "") {
                                handleSubmit(event);
                            }
                        }
                    }}
                    sx={{
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                        "-ms-overflow-style": "nsetValueone",
                        "scrollbar-width": "none",
                    }}
                />
            </Flex>
        </Flex>

    );
};

export default MainPage;
