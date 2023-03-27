import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../Context/ContextProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const MessageBox = ({ messages }) => {

    const { user } = ChatState();

    const isSameSender = (messages, message, i, userId) => {
        return (
            i < messages.length - 1 &&
            (messages[i + 1].sender._id !== message.sender._id ||
                messages[i + 1].sender._id === undefined) &&
            messages[i].sender._id !== userId
        );
    }

    const isLastMessage = (messages, i, userId) => {
        return (
            i === messages.length - 1 &&
            messages[messages.length - 1].sender._id !== userId &&
            messages[messages.length - 1].sender._id
        )
    }

    const setMarginForUser = (messages, message, i, userId) => {
        if (
            i < messages.length - 1 &&
            messages[i + 1].sender._id === message.sender._id &&
            messages[i].sender._id !== userId
        )
            return 33;

        else if (
            (i < messages.length - 1 &&
                messages[i + 1].sender._id !== message.sender._id &&
                messages[i].sender._id !== userId) ||
            (i === messages.length - 1 &&
                messages[i].sender._id !== userId)
        )
            return 0;

        else
            return "auto"
    }

    const isSameUser = (messages, i, message) => {
        return i > 0 && messages[i - 1].sender._id === message.sender._id
    }

    return (
        <ScrollableFeed>
            {messages && messages.map((message, i) =>
                <div style={{ display: "flex" }} key={message._id}>
                    {(isSameSender(messages, message, i, user._id) ||
                        isLastMessage(messages, i, user._id)) &&
                        <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
                            <Avatar
                                size="sm"
                                mt="7px"
                                ml={1}
                                mr={1}
                                cursor="pointer"
                                name={message.sender.name}
                                src={message.sender.image}
                            />
                        </Tooltip>
                    }
                    <span
                        style={{
                            backgroundColor: `${message.sender._id === user._id ? "#40e0d0" : "#008B8B"}`,
                            maxWidth: "75%"
                            , color: "white", borderRadius: "10px", fontSize: "0.8rem", padding: "5px 10px",

                            marginLeft: setMarginForUser(messages, message, i, user._id),
                            marginTop: isSameUser(messages, i, message) ? 3 : 10
                        }}>
                        {message.content}
                    </span>

                </div>
            )}
        </ScrollableFeed>
    )
}

export default MessageBox
