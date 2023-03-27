import React, { Fragment, useState } from 'react'
import {
    Box, Button, Tooltip, Text, Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    Drawer,
    useDisclosure,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    useToast
} from "@chakra-ui/react"
import { ChevronDownIcon, BellIcon } from "@chakra-ui/icons"
import { ChatState } from '../../Context/ContextProvider'
import ProfileModal from '../ProfileModal'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import ChatLoading from '../ChatLoading'
import UsersList from '../UsersList'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';



const Sidepanel = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate()
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [result, setResult] = useState();


    const { user, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
    // const user = JSON.parse(localStorage.getItem("UserInfo"));
    localStorage.setItem("Notification", JSON.stringify(notifications));
    const logoutHandler = () => {
        localStorage.removeItem("UserInfo");
        // localStorage.removeItem("Notification");
        navigate("/")
    }

    const onSearchHandler = async () => {
        setLoading(true)
        if (!search) {
            toast({
                title: 'Error',
                description: "Search field is empty",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-left'
            })
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await Axios.get(`http://localhost:4000/api/user/getuser?search=${search}`, config);


            console.log(data);
            setResult(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: "Search Failed",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top-left'
            })
            setLoading(false)
            return;
        }

    }

    const accessChat = async (userId) => {
        try {
            setChatLoading(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await Axios.post("http://localhost:4000/api/chats", { userId }, config);

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setChatLoading(false);
            console.log(data)
            onClose();
        }

        catch (error) {
            toast({
                title: 'Error',
                description: "Search Chat Failed",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'bottom-left'
            })
            setChatLoading(false);
            return;

        }
    }




    return (
        <Fragment>
            <Box
                w="100%"
                bg="white"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p="2px 8px 2px 8px"
                borderWidth="0.3rem">
                <Tooltip label="Search Users"
                    hasArrow
                    placement='bottom-end'>
                    <Button variant="ghost"
                        m={1}
                        onClick={onOpen}>
                        <i className="fa fa-search" />
                        <Text
                            display={{ base: "none", md: "flex" }}
                            px="8px"
                            fontFamily="PT Serif"
                        >Search</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="3xl"
                    fontFamily="PT Serif">
                    Chit-And-Chat
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge count={notifications.length} effect={Effect.SCALE} />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList>
                            {notifications.length <= 0 && "No Recent notifications"}
                            {notifications.length > 0 && notifications.map((notification) =>

                                <MenuItem key={notification._id} onClick={() => {
                                    setSelectedChat(notification.chat);
                                    setNotifications(notifications.filter((notifications) => notifications.chat._id !== notification.chat._id));
                                }
                                }>
                                    <MenuDivider />
                                    {notification.chat.isGroup ? `New message in group ${notification.chat.chatname}` :
                                        `New message from ${notification.sender.name}`}

                                </MenuItem>

                            )}
                        </MenuList>

                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" name={user.name} src={user.image} cursor="pointer" />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >


            <Drawer isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'
                        fontFamily="PT Serif">
                        Search Users
                    </DrawerHeader>

                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input placeholder="Enter Username"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)} />
                            <Button
                                colorScheme='teal'
                                onClick={onSearchHandler}
                                fontFamily="PT Serif"
                            >Go</Button>
                        </Box>
                        {loading ? <ChatLoading /> : result?.map((user) => < UsersList key={user._id} users={user}
                            chatFunction={() => accessChat(user._id)} />)}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Fragment>
    )
}

export default Sidepanel
