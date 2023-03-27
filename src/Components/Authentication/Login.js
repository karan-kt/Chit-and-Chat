import React, { useState } from 'react'
import {
    VStack, FormControl, FormLabel, Input,
    InputGroup, InputRightElement, Button, useToast
} from '@chakra-ui/react'
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onShowHandler = () => {
        setShow(!show);
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!email || !password) {
            toast({
                title: 'Failed',
                description: 'Enter the required fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const response = await Axios.post("http://localhost:4000/api/user/login", { email, password }, config);
            toast({
                title: 'Success',
                description: 'login successful',
                status: 'success',
                duration: 5000,
                isClosable: true,

            })
            localStorage.setItem("UserInfo", JSON.stringify(response.data));
            console.log(response.data);
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            if (!error?.response) {
                toast({
                    title: 'Error',
                    description: 'No server reponse',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,

                })
            } else if (error.response?.status === 404) {
                toast({
                    title: 'Error',
                    description: 'Page not found',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,

                })
            } else {
                toast({
                    title: 'error',
                    description: error.response.data,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,

                })
            }
            setLoading(false);
        }
    }

    return (
        <VStack spacing='5px'>

            <FormControl id="Emaillog" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)
                    }
                />
            </FormControl>

            <FormControl id="Passwordlog" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Your Name"
                        onChange={(e) => setPassword(e.target.value)
                        }
                    />
                    <InputRightElement width="4rem">
                        <Button h="2rem" size="sm" onClick={onShowHandler}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                width="100%"
                colorScheme="blue"
                style={{ marginTop: "1rem" }}
                onClick={onSubmitHandler}
                isLoading={loading}>
                Login
            </Button>
            <Button
                width="100%"
                colorScheme="green"
                style={{ marginTop: "1rem" }}>
                Login as Guest User
            </Button>
        </VStack>
    )
}

export default Login
