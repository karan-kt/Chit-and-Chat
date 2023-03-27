const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { chats } = require('./Data/Dummydata')
const ConnectDatabase = require('./Connection/Databasecon');
const userRoutes = require('./Routes/Userroutes');
const chatRoutes = require('./Routes/Chatroutes');
const messageRoutes = require('./Routes/MessageRoutes')


app.use(express.json());
dotenv.config()
app.use(cors());
ConnectDatabase();

app.use("/api/user", userRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/messages", messageRoutes)
// app.get("/chats/alldata", (req, res) => {
//     res.send(chats);
// })


// app.get("/chats/:id", (req, res) => {
//     console.log(req.params.id);
//     const data = chats.find((c) => c._id === req.params.id)
//     res.send(data);
// })


const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server in running on ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
})

io.on('connection', (socket) => {
    console.log("Connected to Socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log("User Connected " + userData._id);
        socket.emit('connected')
    })

    socket.on("Join Chat", (room) => {
        socket.join(room);
        console.log("User Joined " + room)
    })

    socket.on("typing", (room) => socket.in(room).emit('typing'))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("New Message", (newMessage) => {
        var chat = newMessage.chat;

        if (!chat.users) return console.log("Chat not found");

        chat.users.forEach((user) => {
            if (user._id === newMessage.sender._id) return;

            socket.in(user._id).emit("Message received", newMessage);
        })
    })

    socket.on("Leave", (room) => {
        socket.leave(room);
        console.log("User Left " + room);

    })


})