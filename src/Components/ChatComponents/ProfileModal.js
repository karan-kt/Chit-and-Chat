import React from 'react'
import { ChatState } from '../Context/ContextProvider'
import {
    useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, IconButton, ModalCloseButton, Image, Text
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModal = ({ children, user }) => {

    // const { user } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span> :
                <IconButton display={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />} />}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader
                        display="flex"
                        justifyContent="center"
                        fontSize="2xl"
                        fontFamily="PT Serif">
                        Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="center">
                        <Image
                            boxSize="150px"
                            borderRadius='full'
                            src={user.image}
                            alt={user.name}
                            margin="0 0 2rem 0" />
                        <Text
                            fontFamily="PT serif"
                            fontSize="2xl">
                            {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


export default ProfileModal
