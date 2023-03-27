const express = require('express')
const router = express.Router();
const { jwtAuth } = require("../Middleware/jwtAuth");
const { registration, login, getusers } = require('../Controllers/Usercontrollers')


router.post("/register", registration);
router.post("/login", login);
router.get("/getuser", jwtAuth, getusers)


module.exports = router;