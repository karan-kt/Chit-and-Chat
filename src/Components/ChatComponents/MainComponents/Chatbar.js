import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { ChatState } from '../../Context/ContextProvider';
import { AddIcon } from '@chakra-ui/icons';
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react';
import ChatLoading from '../ChatLoading';
import classes from "./Chatbar.module.css"
import GroupChatModal from '../GroupChatModal';


const Chatbar = ({ update }) => {
    const toast = useToast();

    // const [userLogged, setUserLogged] = useState();
    const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await Axios.get("http://localhost:4000/api/chats", config);
            console.log("chatbar all chats", data)
            setChats(data);
            console.log("chats", chats)
        } catch (error) {
            toast({
                title: 'Error',
                description: "Chats not found",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
        }

    }

    useEffect(() => {
        // setUserLogged(JSON.parse(localStorage.getItem("UserInfo")));
        fetchChats();

    }, [update])

    const getSender = (logged, usersList) => {
        return usersList[0]._id === logged._id ? usersList[1].name : usersList[0].name;

    }

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            p={1}
            bg="white"
            w={{ base: "100%", md: "30%" }}
            borderRadius="lg"
            borderWidth="1px"
            fontFamily="PT Serif">
            <Box
                fontSize={{ base: "20px", md: "24px" }}
                display="flex"
                width="100%"
                justifyContent="space-between"
                alignItems="center"
                margin="0 0 3px 0">
                Your Chats
                <GroupChatModal>
                    <Button
                        fontSize={{ base: "14px", md: "12px", lg: "14px" }}
                        display="flex"
                        rightIcon={<AddIcon />}>
                        Create Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                p={2}
                background="#F8F8F8"
                width="100%"
                height="100%"
                overflow="hidden">
                {chats ? (
                    <Stack
                        className={classes.chatstack}
                        overflowY="scroll">
                        {
                            chats.map((chat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    key={chat._id}
                                    px={2}
                                    py={2}
                                    borderEndRadius="lg"
                                    bg={selectedChat === chat ? "green" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}>

                                    <Text>
                                        {!chat.isGroup ? getSender(user, chat.users) : chat.chatname}
                                    </Text>
                                    <Text fontSize="xs">
                                        {!chat.latestMessage ? "" : <> <b>Last Message:</b> {chat.latestMessage.content}</>}
                                    </Text>
                                </Box>
                            ))
                        }

                    </Stack>
                ) :
                    <ChatLoading />}
            </Box>
        </Box>
    )
}

export default Chatbar;
