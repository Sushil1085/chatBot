import { Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Text, Toast, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const SignUp = () => {

    const [username, setUsername] = useState('');
    const [emailid, setEmailid] = useState('');
    const [password, setPassword] = useState('');
    const [consfirmPassword, setConfirmPassword] = useState('');

    const toast = useToast()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !emailid || !password) {
            toast({
                title: "Please fill all the fields",
                description: "All fields are required",
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            });
            return
        }
        if(password !== consfirmPassword){
            toast({
                title: "Password does not match",
                description: "Please check your password",
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            });
            return
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailid)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address (e.g., abc@gmail.com)",
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            });
            return;
        }

        try {

            const response = await axios.post("http://localhost:5000/adduser", {
                username: username,
                emailid: emailid,
                password: password
            })

            if (response.data.message === "User added successfully") {
                toast({
                    title: "User added successfully",
                    description: "Please login to continue",
                    status: "success",
                    duration: 5000,
                    position: "top",
                    isClosable: true,
                });
                navigate("/");
            }
        } catch (err) {
            console.log(err);
            toast({
                title: "Something wents wrong",
                description: "Please check your credentials",
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            });
        }

    }

    return (
        <>
            <Box h="100vh" bg="#1A202C"  >
                <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"} >
                    <Flex h={"600px"} w={"500px"} bg={"#171923"} color={"white"} justifyContent={"center"} alignItems={"center"} borderRadius={"20px"} flexDirection={"column"} >

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
                            <Input mb={"20px"} placeholder='Password'
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />

                            <FormLabel >Confirm Password</FormLabel>
                            <Input placeholder='Confirm Password'
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={consfirmPassword}
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