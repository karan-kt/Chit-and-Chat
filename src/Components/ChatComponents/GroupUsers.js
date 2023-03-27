import React from 'react'
import { Box, Icon } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

const GroupUsers = ({ handleDelete, members }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            variant="solid"
            cursor="pointer"
            bg="green"
            color="white"
            fontSize="14px"
            display="flex"
            alignItems="center">
            {members.name}
            <Icon fontWeight="bold" boxSize="8px" ml={1} onClick={handleDelete}><CloseIcon /></Icon>
        </Box>
    )
}

export default GroupUsers
