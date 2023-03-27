import React, { Fragment, useState } from 'react'
import {
    Modal, useDisclosure, IconButton,
    ModalBody, ModalCloseButton, ModalFooter, ModalOverlay, ModalHeader, Button,
    ModalContent, FormControl, FormLabel, Input, Text, Box, useToast, Spinner
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../Context/ContextProvider'
import GroupUsers from './GroupUsers'
import Axios from 'axios';
import UsersList from './UsersList'

const UpdateGroupChatModal = ({ children, update, setUpdate, fetchMessages } = {}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = ChatState();

    const toast = useToast();
    const [renameGroup, setRenameGroup] = useState("");
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const handleRenameGroup = async (chatName) => {
        if (!chatName) {
            toast({
                title: 'Error',
                description: "Enter new group name",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await Axios.put("http://localhost:4000/api/chats/rename",
                { chatId: selectedChat._id, chatName: renameGroup }, config);

            toast({
                title: 'Success',
                description: "Group renamed successful",
                duration: 5000,
                status: "success",
                isClosable: true,
                position: 'bottom',
            })
            setSelectedChat(data);
            console.log(data);
            setUpdate(!update);
            setLoading(false);

        } catch (error) {
            toast({
                title: 'Error',
                description: "Renaming unsuccessful",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false);
            return;

        }
        setRenameGroup("");

    }

    const searchMembers = async (searchQuery) => {
        setSearch(searchQuery)
        if (!search) {
            return;
        }

        try {
            setSearchLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await Axios.get(`http://localhost:4000/api/user/getuser?search=${search}`, config);
            setSearchResult(data);
            setSearchLoading(false);

        } catch (error) {
            toast({
                title: 'Error',
                description: "Search unsuccessful",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false);
            return;
        }

    }

    const addMembers = async (memberSelect) => {
        console.log(memberSelect._id, selectedChat)
        if (selectedChat.users.find((member) => member._id === memberSelect._id)) {
            toast({
                title: 'Error',
                description: "User already exists in group",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false);
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Error',
                description: "Only admin can add users",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false);
            return;
        }

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await Axios.put("http://localhost:4000/api/chats/groupadd",
                {
                    groupId: selectedChat._id,
                    userId: memberSelect._id
                }, config)

            setSelectedChat(data);
            setUpdate(!update);

        } catch (error) {
            toast({
                title: 'Error',
                description: "User couldn't be added",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false);
            return;

        }

    }

    const handleRemoveMember = async (memberSelect) => {
        if (selectedChat.groupAdmin._id !== user._id && memberSelect._id !== user._id) {
            toast({
                title: 'Error',
                description: "Only admin can remove users",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await Axios.put("http://localhost:4000/api/chats/groupremove",
                {
                    groupId: selectedChat._id,
                    userId: memberSelect._id
                }, config)

            memberSelect._id === user._id ? setSelectedChat() : setSelectedChat(data);
            fetchMessages();
            setUpdate(!update);
            setLoading(false);

        } catch (error) {
            toast({
                title: 'Error',
                description: "User couldn't be removed",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false);
            return;
        }

    }



    return (
        <Fragment>
            <IconButton display="flex" onClick={onOpen} icon={<ViewIcon />} />

            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontFamily="PT Serif" display="flex"
                        alignItems="center" flexDirection='column' justifyContent="center">
                        {selectedChat.chatname}
                        <Text fontSize='10px'>Admin:{selectedChat.groupAdmin.name}</Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody fontFamily="PT Serif" display="flex" flexDirection="column" alignItems="center">
                        Members:
                        <Box display="flex" flexWrap="wrap" mb={2}>
                            {selectedChat.users.map((members) => <GroupUsers key={members._id} members={members}
                                handleDelete={() => handleRemoveMember(members)} />)}
                        </Box>
                        <FormControl mb={2} id="newname" display="flex" justifyContent="space-between">
                            <Input placeholder='New group name' value={renameGroup} onChange={(e) => setRenameGroup(e.target.value)}></Input>
                            <Button ml={1} colorScheme="green" onClick={() => handleRenameGroup(renameGroup)}
                                isLoading={loading}>Rename</Button>
                        </FormControl>

                        <FormControl mb={2} id="searchusers">
                            <FormLabel>Add Members</FormLabel>
                            <Input placeholder='Search users' onChange={(e) => searchMembers(e.target.value)}></Input>
                        </FormControl>

                        {searchLoading ? <Spinner size="md" /> : searchResult?.map((members) => <UsersList key={members._id}
                            users={members} chatFunction={() => addMembers(members)} />)}
                    </ModalBody>

                    <ModalFooter fontFamily="PT Serif">
                        <Button colorScheme="blue" onClick={onClose} isLoading={loading}>
                            Close
                        </Button>
                        <Button colorScheme='red' ml={1} onClick={() => handleRemoveMember(user)}
                            isLoading={loading}>Leave Group</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Fragment>
    )
}

export default UpdateGroupChatModal
