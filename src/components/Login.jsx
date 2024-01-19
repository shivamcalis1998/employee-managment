import React, { useState } from "react";
import axios from "axios";
import img from "../images/background.jpg";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://reqres.in/api/login",
        credentials
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Error occurred during login");
      console.error("Login error:", error);

      if (error.response) {
        console.error("Error details:", error.response);
      }
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={8}
      p={7}
      borderWidth="1px"
      borderRadius="lg"
      bgImage={img}
      bgSize="cover"
      color="white"
    >
      <Heading mb={4}>Login Page</Heading>
      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel>Email:</FormLabel>
            <Input
              type="text"
              name="email"
              value={credentials.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Login
          </Button>
        </Stack>
      </form>
      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      )}
    </Box>
  );
};

export default Login;
