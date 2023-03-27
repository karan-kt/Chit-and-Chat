import React, { useState, Fragment } from 'react'
import {
    VStack, FormControl, FormLabel, Input,
    InputGroup, InputRightElement, Button, useToast
} from '@chakra-ui/react'
import Axios from 'axios';


const Signup = () => {
    const toast = useToast()
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState("");

    const onShowHandler = () => {
        setShow(!show);
    }

    const onImageHandler = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: 'Failed',
                description: 'Please select proper image',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }


        console.log(pic)
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "SocialMedia");
            data.append("cloud_name", "karandicle");
            fetch("https://api.cloudinary.com/v1_1/karandicle/image/upload", {
                method: "post",
                body: data,

            }).then((res) => res.json())
                .then((data) => {
                    setImage(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false)

                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
        } else {
            toast({
                title: 'Failed',
                description: 'Please select proper image',
                status: 'error',
                duration: 5000,
                isClosable: true,

            })
            setLoading(false);
            return;
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!name || !password || !repassword || !email) {
            toast({
                title: 'Failed',
                description: 'Please fill the required fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        if (password !== repassword) {
            toast({
                title: 'Failed',
                description: 'Password doesnt match.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            toast({
                title: 'Too weak',
                description: 'Password should be more than 6 characters',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        // formData.append("repassword", repassword);
        const pic = image ? formData.append("image", image) : "";
        // console.log(formData)

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            };

            const response = await Axios.post("http://localhost:4000/api/user/register",
                formData, config);
            toast({
                title: 'Success',
                description: 'Sign-up successful',
                status: 'success',
                duration: 5000,
                isClosable: true,

            })
            setLoading(false);

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

        console.log(name, email, password, image);
    }

    return (
        <Fragment>
            <VStack spacing='5px'>
                <FormControl id="Name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter Your Name"
                        onChange={(e) => setName(e.target.value)
                        }
                    />
                </FormControl>

                <FormControl id="Email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        placeholder="Enter Your Email"
                        onChange={(e) => setEmail(e.target.value)
                        }
                    />
                </FormControl>

                <FormControl id="Password" isRequired>
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

                <FormControl id="Re-Password" isRequired>
                    <FormLabel>Re-Enter Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? "text" : "password"}
                            placeholder="Re-Enter Your Name"
                            onChange={(e) => setConfirmPassword(e.target.value)
                            }
                        />
                        <InputRightElement width="4rem">
                            <Button h="2rem" size="sm" onClick={onShowHandler}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl id="Picture">
                    <FormLabel>Choose Profile Pic</FormLabel>
                    <Input
                        type="file"
                        placeholder="Enter Your Name"
                        accept='image/*'
                        onChange={(e) => onImageHandler(e.target.files[0])
                        }
                    />
                </FormControl>

                <Button
                    type="submit"
                    width="100%"
                    colorScheme="blue"
                    style={{ marginTop: "1rem" }}
                    onClick={onSubmitHandler}
                    isLoading={loading}>
                    Sign Up
                </Button>
            </VStack>

        </Fragment>
    )
}

export default Signup
