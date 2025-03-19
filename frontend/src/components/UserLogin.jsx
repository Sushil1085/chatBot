import { Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Text } from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const UserLogin = () => {

    const [emailid, setEmailid] = useState('');
    const [password, setPassword] = useState('');

    const isError = !emailid || !password

    const navigate = useNavigate();

    const handleSubmit =async(e)=>{
        e.preventDefault();

        const response =await axios.post("http://localhost:5000/loginuser",{
            emailid:emailid,
            password:password
        })
        const userid=response.data.user.userid;
        
        
        if(response){
            navigate(`/${userid}`);
        }
    }

    return (
        <>
            <Box h="100vh" bg="#1A202C"  >
                <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"} >
                    <Flex h={"500px"} w={"500px"} bg={"#171923"} color={"white"} justifyContent={"center"} alignItems={"center"} borderRadius={"20px"} flexDirection={"column"} >
                        
                        <Heading mb={"20px"} fontSize={"30px"}>Login</Heading>
                        
                        <FormControl isInvalid={isError} w={"60%"}>
                            <FormLabel>Email</FormLabel>
                            <Input type='email' value={emailid} onChange={(e) => setEmailid(e.target.value)} />
                            {!isError ? (
                                <FormHelperText>
                                    Enter the email.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>Email is required.</FormErrorMessage>
                            )}

                            <FormLabel>Password</FormLabel>
                            <Input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                            {!isError ? (
                                <FormHelperText>
                                    Enter the Password.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>Password is required.</FormErrorMessage>
                            )}
                        </FormControl>

                        <Button onClick={handleSubmit} colorScheme='blue' mt={"70px"} >Login</Button>
                        
                        <Text alignSelf="flex-start" ml={"20px"} mt={"20px"} color={"gray"} cursor="pointer" onClick={()=>navigate("/signup")} >Don't have an account?</Text>
                        
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default UserLogin;