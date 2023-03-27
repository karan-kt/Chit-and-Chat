const mongoose = require('mongoose');

const Chatmodel = mongoose.Schema({
    chatname: {
        type: String,
        trim: true
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    {
        timestamps: true,
    }
)

const Chat = mongoose.model("Chat", Chatmodel)
module.exports = Chat;