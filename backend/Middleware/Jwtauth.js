const jwt = require('jsonwebtoken');
const User = require('../Model/Usermodel.js');
const asyncHandler = require('express-async-handler');

const jwtAuth = asyncHandler(async (req, res, next) => {

    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SecretKey)
            req.user = await User.findById(decoded.id).select("-password");

            next();

        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not Authorized, token not found");
    }
})

module.exports = { jwtAuth };