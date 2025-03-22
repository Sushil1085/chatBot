import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useChat } from "../ChatContext";
import { useToast } from "@chakra-ui/react";

const UserLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUsername } = useChat();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/loginuser", {
        emailid: data.email,
        password: data.password,
      });

      setUsername(response.data.user.username);
      const userid = response.data.user.userid;

      if (response) {
        toast({
          title: "Login Successful!",
          description: "Welcome back!",
          status: "success",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
        navigate(`/${userid}`);
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Login Failed!",
        description: "Invalid Credentials!",
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  };
  

  return (
    <Box h="100vh" bg="#1A202C">
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <Flex
          h="500px"
          w="500px"
          bg="#171923"
          color="white"
          justifyContent="center"
          alignItems="center"
          borderRadius="20px"
          flexDirection="column"
        >
          <Heading mb="20px" fontSize="30px">
            Login
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "60%" }}>
            {/* Email Field */}
            <FormControl isInvalid={errors.email}>
              
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required",pattern:{value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email format" } })}
              />
              {errors.email ? (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              ) : (
                <FormHelperText>Enter the email.</FormHelperText>
              )}
            </FormControl>

            {/* Password Field */}
            <FormControl isInvalid={errors.password} mt="20px">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required", minLength: 6 })}
              />
              {errors.password ? (
                <FormErrorMessage>{errors.password.message}</FormErrorMessage>
              ) : (
                <FormHelperText>Enter the Password.</FormHelperText>
              )}
            </FormControl>

            <Button type="submit" colorScheme="blue" mt="40px" width="100%">
              Login
            </Button>
          </form>

          <Text
            alignSelf="flex-start"
            ml="20px"
            mt="20px"
            color="gray"
            cursor="pointer"
            onClick={() => navigate("/signup")}
          >
            Don't have an account?
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
export default UserLogin;
