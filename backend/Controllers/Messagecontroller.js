const Message = require("../Model/Messagemodel");
const User = require("../Model/Usermodel");
const Chat = require("../Model/Chatmodel");
const Notification = require("../Model/Notificationmodel")
const asyncHandler = require("express-async-Handler");



//sendMessage http://localhost:4000/api/messages
const sendMessages = asyncHandler(async (req, res) => {
    const { chatId, Text } = req.body;

    if (!chatId || !Text) {
        console.log("Data sended is incomplete")
        return res.status(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: Text,
        chat: chatId
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name image")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name image email"
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        })

        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})




//getAlltMessages http://localhost:4000/api/messages/:chatID
const getAllMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    try {
        const message = await Message.find({ chat: chatId })
            .populate("sender", "name image email").populate("chat");

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})

//setNotification http://localhost:4000/api/messages/notification

const getNotification = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;

    var newNotification = {
        userId: userId,
        chat: chatId,

    };

    try {
        var notify = await Notification.create(newNotification);

        notify = await notify.populate("chat");
        res.json(notify);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})

//deleteNotification http://localhost:4000/api/messages/deleteNotification

const deleteNotification = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;

    try {
        const read = await Notification.remove({ userId: userId, chat: chatId })
        res.send("Deleted")
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})

module.exports = { sendMessages, getAllMessages, getNotification, deleteNotification }
