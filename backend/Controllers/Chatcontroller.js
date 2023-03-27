const Chat = require('../Model/Chatmodel.js');
const User = require('../Model/Usermodel.js');
const asyncHandler = require('express-async-Handler');


///accesschat http://localhost:4000/api/chats
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("User id not sended")
        return res.status(400);
    }

    var isChat = await Chat.find({
        isGroup: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password")
        .populate(("latestMessage"))

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name image email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var createChat = {
            chatname: "sender",
            isGroup: false,
            users: [req.user._id, userId]
        };


        try {
            const createdChat = await Chat.create(createChat);

            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password")

            res.status(200).send(fullChat);

        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
    }

})

///fetchChats http://localhost:4000/api/chats
const fetchChat = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name image email"
                })
                res.status(200).send(result);
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})

///group http://localhost:4000/api/chats/group

const groupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill the required details" });
    }

    var users = JSON.parse(req.body.users);
    users.push(req.user);
    if (users.length < 2) {
        res.status(400).send("2 or more users needed");
    }
    try {
        const groupChat = await Chat.create({
            chatname: req.body.name,
            isGroup: true,
            users: users,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})


///group http://localhost:4000/api/chats/rename
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const update = await Chat.findByIdAndUpdate(chatId, {
        chatname: chatName,
    },
        {
            new: true,
        })
        .populate("users", "-passowrd")
        .populate("groupAdmin", "-password")

    if (!update) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(update);
    }

})


///group http://localhost:4000/api/chats/groupadd
const groupAdd = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;

    const add = await Chat.findByIdAndUpdate(groupId,
        {
            $push: { users: userId }
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")


    if (!add) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(add);
    }

})


///group http://localhost:4000/api/chats/groupremove

const groupRemove = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body

    const remove = await Chat.findByIdAndUpdate(groupId, {
        $pull: { users: userId },
    },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!remove) {
        res.status(404);
        throw new Error("User not found");
    } else {
        res.json(remove);
    }
})



module.exports = { accessChat, fetchChat, groupChat, renameGroup, groupAdd, groupRemove }