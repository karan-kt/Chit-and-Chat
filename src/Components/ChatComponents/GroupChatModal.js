import React, { Fragment, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    FormLabel,
    Input,
    Spinner,
    Box
} from '@chakra-ui/react'
import { ChatState } from '../Context/ContextProvider';
import Axios from 'axios';
import UsersList from './UsersList';
import GroupUsers from './GroupUsers';

const GroupChatModal = ({ children }) => {
    const toast = useToast();

    const [groupName, setGroupName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState(false);

    const { isOpen, onClose, onOpen } = useDisclosure();

    const { user, chats, setChats } = ChatState();

    const searchMembers = async (member) => {
        setSearch(member);
        if (!member) {
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await Axios.get(`http://localhost:4000/api/user/getuser?search=${search}`, config);
            setSearchResult(data);
            console.log(data);
            setLoading(false);
        }
        catch (error) {
            toast({
                title: 'Error',
                description: "Chats not found",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
            setLoading(false)
            return;
        }
    }

    const addMembers = (addMember) => {
        if (groupMembers.includes(addMember)) {
            toast({
                title: 'Error',
                description: "Member already added",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }

        setGroupMembers([...groupMembers, addMember])
    }

    const submitHandler = async () => {
        if (!groupName || !groupMembers) {
            toast({
                title: 'Error',
                description: "Please fill the required fields",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            return;
        }

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await Axios.post("http://localhost:4000/api/chats/group",
                { name: groupName, users: JSON.stringify(groupMembers.map((id) => id._id)) }, config);

            setChats([data, ...chats])
            onClose();
            toast({
                title: 'Success',
                description: "Group was created",
                duration: 5000,
                status: "success",
                isClosable: true,
                position: 'bottom',
            })

        } catch (error) {
            toast({
                title: 'Error',
                description: "Group not created successfully",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: 'bottom',
            })
            return;
        }

    }

    const handleDelete = (members) => {
        setGroupMembers(groupMembers.filter((sel) => sel._id !== members._id));
    }

    const onCloseHandler = () => {
        onClose();
        setGroupName("");
        setSearchResult([])
        setGroupMembers([]);
    }

    return (
        <Fragment>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent
                    fontFamily="PT Serif">
                    <ModalHeader display="flex"
                        justifyContent="center">Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" alignItems="center" >

                        <FormControl id="groupname" mb={3} isRequired>
                            <FormLabel>Enter Group Chat Name</FormLabel>
                            <Input type="text" placeholder="Enter group name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}></Input>
                        </FormControl>

                        <FormControl id="groupmembers" mb={2} isRequired>
                            <FormLabel>Search Members</FormLabel>
                            <Input type="text" placeholder="Select members"
                                onChange={(e) => searchMembers(e.target.value)}></Input>
                        </FormControl>
                        <Box display="flex" flexWrap="wrap" fontSize='1xl'>
                            {groupMembers ? groupMembers.map((member) => <GroupUsers key={member._id}
                                members={member} handleDelete={() => handleDelete(member)} />) : ""}
                        </Box>
                        {loading ? < Spinner size='md' /> : searchResult?.slice(0, 4).map((user) => < UsersList key={user._id} users={user}
                            chatFunction={() => addMembers(user)} />)
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={2} onClick={onCloseHandler}>
                            Close
                        </Button>
                        <Button colorScheme="green" onClick={submitHandler}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Fragment>
    )
}

export default GroupChatModal
