import React, { useEffect } from 'react'
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";
import {
    Container, Box, Text, TabList,
    Tabs, Tab, TabPanels, TabPanel
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("UserInfo"));

        if (userInfo) {
            navigate("/chats");
        }
    }, [navigate])

    return (
        <Container maxW='xl' centerContent>
            <Box
                display="flex"
                w="100%"
                justifyContent="center"
                p={2}
                bg={"white"}
                m="1.5rem 0 1rem 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text
                    fontSize="4xl"
                    color="black"
                    fontFamily="PT Serif"
                >Chit-And-Chat</Text>
            </Box>
            <Box
                w="90%"
                background="white"
                p={3}
                m="0 0 1rem 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Tabs size="md"
                    variant='soft-rounded'
                    colorScheme="blue"
                    fontFamily="PT Serif">
                    <TabList
                    >
                        <Tab w="50%">Login</Tab>
                        <Tab w="50%">Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Container>
    )
}

export default Home