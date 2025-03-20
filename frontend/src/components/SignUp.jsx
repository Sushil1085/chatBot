import { Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Text } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const SignUp = () => {

    const [username, setUsername] = useState('');
    const [emailid, setEmailid] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post("http://localhost:5000/adduser", {
            username: username,
            emailid: emailid,
            password: password
        })

        if (response.data.message === "User added successfully") {
            navigate("/login");
        }


    }

    return (
        <>
            <Box h="100vh" bg="#1A202C"  >
                <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"} >
                    <Flex h={"500px"} w={"500px"} bg={"#171923"} color={"white"} justifyContent={"center"} alignItems={"center"} borderRadius={"20px"} flexDirection={"column"} >

                    <Heading mb={"20px"} fontSize={"30px"}>Sign Up</Heading>

                        <FormControl isRequired w={"60%"} >
                            <FormLabel >User name</FormLabel>
                            <Input mb={"20px"} placeholder='User name'
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />

                            <FormLabel>Email Id</FormLabel>
                            <Input mb={"20px"} placeholder='Email Id'
                                onChange={(e) => setEmailid(e.target.value)}
                                value={emailid}
                            />

                            <FormLabel >Password</FormLabel>
                            <Input placeholder='Password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />


                        </FormControl>

                        <Button onClick={handleSubmit} colorScheme='blue' mt={"50px"} >Sign Up</Button>

                        <Text alignSelf="flex-start" ml={"20px"} mt={"20px"} color={"gray"} cursor="pointer" onClick={() => navigate("/")} >Already have an account</Text>

                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default SignUp;