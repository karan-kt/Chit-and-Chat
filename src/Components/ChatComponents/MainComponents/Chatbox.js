import React from 'react'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../../Context/ContextProvider'
import MessagePanel from '../MessagePanel'

const Chatbox = ({ update, setUpdate }) => {

    const { selectedChat } = ChatState();

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            p={2}
            bg="white"
            w={{ base: "100%", md: "69%" }}
            borderRadius="lg"
            borderWidth="1px"
            fontFamily="PT Serif">
            <MessagePanel update={update} setUpdate={setUpdate} />
        </Box>
    )
}

export default Chatbox
