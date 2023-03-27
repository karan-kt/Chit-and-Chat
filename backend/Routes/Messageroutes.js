const express = require('express')
const router = express.Router();
const { jwtAuth } = require("../Middleware/jwtAuth");
const { sendMessages, getAllMessages, getNotification, deleteNotification } = require("../Controllers/Messagecontroller")

router.post("/", jwtAuth, sendMessages);
router.get("/:chatId", jwtAuth, getAllMessages);
router.post("/notification", jwtAuth, getNotification)
router.put("/deletenotification", jwtAuth, deleteNotification)


module.exports = router;