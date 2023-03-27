import React, { Fragment, useState, useEffect } from 'react'
import { ChatState } from '../Context/ContextProvider'
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from '@chakra-ui/react'
import { ArrowLeftIcon } from '@chakra-ui/icons'
import ProfileModal from './ProfileModal'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import Axios from 'axios';
import classes from "./MessagePanel.module.css";
import MessageBox from "./MessageBox"
import io from 'socket.io-client';
// import Dotloader from "../Images/dotloader.gif"


const EndPoint = "http://localhost:4000";
var socket, selectedChatCompare;

const MessagePanel = ({ update, setUpdate }) => {
    const toast = useToast();

    const [socketConnected, setSocketConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState("");
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();
    // const noti = JSON.parse(localStorage.getItem("Notification"));
    // setNotifications(noti);

    const getSender = (user, users) => {
        return user._id === users[0]._id ? users[1].name : users[0].name;
    }

    const getSenderFullData = (user, users) => {
        return user._id === users[0]._id ? users[1] : users[0];
    }

    useEffect(() => {
        socket = io(EndPoint);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, [])

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }

        try {
            setLoading(true);
            console.log('error');

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await Axios.get(`http://localhost:4000/api/messages/${selectedChat._id}`, config)
            setMessages(data);
            console.log(data);
            socket.emit("Join Chat", selectedChat._id);
            setLoading(false);

        } catch (error) {
            toast({
                title: 'Error',
                description: "Coundn't load messages",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            return;
        }
    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessages) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                const { data } = await Axios.post("http://localhost:4000/api/messages",
                    { chatId: selectedChat._id, Text: newMessages }, config);
                setNewMessages("");
                console.log(data);
                socket.emit("New Message", data)
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: "Couldn't send message",
                    duration: 5000,
                    status: "error",
                    isClosable: true,
                    position: 'bottom',
                })
                return;
            }
        }
    }

    // const setNotification = async (userId, chatId) => {

    //     try {
    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${user.token}`,
    //             }
    //         }
    //         await Axios.post("http://localhost:4000/api/messages/notification",
    //             {
    //                 userId: userId,
    //                 chatId: chatId
    //             }, config)

    //     } catch (error) {
    //         toast({
    //             title: 'Error',
    //             description: "Couldn't send notification",
    //             duration: 5000,
    //             status: "error",
    //             isClosable: true,
    //             position: 'bottom',
    //         })
    //         return;
    //     }

    // }

    // console.log("---Notification---", notifications);

    console.log("---Notification Running---");
    useEffect(() => {
        socket.on("Message received", (newMessage) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {

                // notifications.forEach((noti) => {
                //     if (noti.chat._id === newMessage.chat._id) return;
                // })
                console.log("---Notification Running1---", notifications);
                if (!notifications.includes(newMessage)) {
                    // setNotification(user._id, newMessage.chat._id)
                    setNotifications([newMessage, ...notifications]);
                    setUpdate(!update);
                }
            } else {
                setMessages([...messages, newMessage])
            }
        })
    })

    const onArrowClick = async () => {
        await socket.emit("Leave", selectedChat._id);
        setSelectedChat("");
    }

    const onTypingHandler = (e) => {
        setNewMessages(e.target.value);

        if (!socketConnected)
            return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timer = 3000;

        setTimeout(() => {
            let newTime = new Date().getTime();
            let timeDifference = newTime - lastTypingTime;

            if (timeDifference >= timer && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false);
            }

        }, timer)

    }

    // console.log(selectedChat);
    return (
        <Fragment>
            {selectedChat ? <><Text fontSize={{ base: "2xl", md: "3xl" }}
                pb={3}
                px={2}
                mb={2}
                w="100%"
                display="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center">

                <IconButton fontSize={{ base: "12px" }}
                    onClick={onArrowClick}
                    display={{ base: 'flex', md: "none" }}>
                    <ArrowLeftIcon />
                </IconButton>

                {selectedChat.isGroup ?
                    <>{selectedChat.chatname}
                        <UpdateGroupChatModal update={update} setUpdate={setUpdate}
                            fetchMessages={fetchMessages} />
                    </> :
                    <>
                        {getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderFullData(user, selectedChat.users)} />
                    </>}

            </Text>

                <Box background="#E8E8E8"
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    w="100%"
                    h="100%"
                    p={1}
                    overflow="hidden"
                    borderRadius="lg">

                    {loading ? <Spinner
                        alignSelf="center"
                        margin="auto"
                        w={20}
                        height={20} /> :
                        <div className={classes.chatBox}>
                            <MessageBox messages={messages} />
                        </div>}

                    <FormControl id="message" onKeyDown={sendMessage} mt={3} isRequired>
                        {isTyping && <p>Typing...</p>}
                        <Input
                            background="#E0E0E0"
                            variant='filled'
                            placeholder='Enter you message'
                            onChange={onTypingHandler}
                            value={newMessages} />
                    </FormControl>

                </Box>
            </>
                :
                <Box display="flex" alignItems="center" height="100%" justifyContent="center" fontSize="3xl">
                    Select Chat To View Messages
                </Box>}




        </Fragment>
    )
}

export default MessagePanel
