import React from 'react';
import { Avatar, Box, Text } from '@chakra-ui/react';

const UsersList = ({ users, chatFunction }) => {
    return (
        <Box bg="#F0F0F0"
            display="flex"
            justify-content="center"
            fontFamily="PT Serif"
            _hover={{
                background: "green",
                color: "white"
            }}
            alignItems="center"
            p={1}
            mb={2}
            width="100%"
            onClick={chatFunction}
            cursor="pointer">
            <Avatar size='sm'
                name={users.name}
                src={users.image}
                m={2} />
            <Box>
                <Text fontSize="1xl">{users.name}</Text>
                <Text fontSize="0.6rem"><b>Email:</b>{users.email}</Text>
            </Box>
        </Box >
    )
}

export default UsersList
