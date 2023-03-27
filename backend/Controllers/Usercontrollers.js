const User = require('../Model/Usermodel.js');
const asyncHandler = require('express-async-Handler');
const generateToken = require('../Connection/Jwt')

//Registration http://localhost:4000/api/user/register
const registration = asyncHandler(async (req, res) => {
    const { name, email, password, image } = req.body;

    const userExists = await User.findOne({ email: email })
    if (userExists) {
        res.status(400).send("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        image
    })

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
})


//Login http://localhost:4000/api/user/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;


    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            token: generateToken(user._id)
        })
    } else {
        res.status(401).send("Invalid Email or Password");
        throw new Error("Invalid Email or Password");
    }

})


//getuser http://localhost:4000/api/user/getuser?search=karan

const getusers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};
    // console.log(keyword);

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    // const users = await User.find()
    res.send(users);

})


module.exports = { registration, login, getusers }