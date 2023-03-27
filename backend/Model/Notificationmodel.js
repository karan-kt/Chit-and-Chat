const mongoose = require('mongoose');


const Notificationmodel = mongoose.Schema({
    userId: {
        type: String,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
},
    {
        timestamps: true,
    }
)

const Notification = mongoose.model("Notification", Notificationmodel);
module.exports = Notification;