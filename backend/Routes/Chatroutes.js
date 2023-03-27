const express = require('express')
const router = express.Router();
const { jwtAuth } = require("../Middleware/jwtAuth");
const { accessChat, fetchChat, groupChat, renameGroup, groupAdd, groupRemove } = require("../Controllers/Chatcontroller");


router.post("/", jwtAuth, accessChat);
router.get("/", jwtAuth, fetchChat);
router.post("/group", jwtAuth, groupChat);
router.put("/rename", jwtAuth, renameGroup);
router.put("/groupadd", jwtAuth, groupAdd);
router.put("/groupremove", jwtAuth, groupRemove);

module.exports = router;