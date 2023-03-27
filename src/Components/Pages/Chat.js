import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ContextProvider'
import { Box } from "@chakra-ui/layout";
import Sidepanel from "../ChatComponents/MainComponents/Sidepanel";
import Chatbar from "../ChatComponents/MainComponents/Chatbar";
import Chatbox from "../ChatComponents/MainComponents/Chatbox";
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();
    const { user } = ChatState();

    const [update, setUpdate] = useState(false);
    // const userInfo = JSON.parse(localStorage.getItem("UserInfo"));
    // console.log("user2", userInfo);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [navigate])

    return (
        <div style={{ width: '100%' }}>
            {user && <Sidepanel />}
            <div>
                <Box display="flex"
                    justifyContent="space-between"
                    w="100%"
                    h="90vh"
                    p="10px">
                    {user && <Chatbar update={update} setUpdate={setUpdate} />}
                    {user && <Chatbox update={update} setUpdate={setUpdate} />}
                </Box>
            </div>
        </div>
    )
}

export default Chat
