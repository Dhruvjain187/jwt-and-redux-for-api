const asyncHandler = require("express-async-handler")
const { User } = require("../model/userModel")
const generateToken = require("../utils/generateToken")

//des Auth user/set token
//route POST /api/users/auth
//@access Public
module.exports.authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(401);
        throw new Error("Invalid email or password")
    }

})


//des register a new user
//route POST /api/users
//@access Public
module.exports.registerUser = asyncHandler(async (req, res) => {
    const { name, password, email } = req.body;
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400);
        throw new Error("user already exist")
    }

    const user = await User.create({
        name, password, email
    })

    if (user) {
        generateToken(res, user._id)
        user.save()
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(401);
        throw new Error("Invalid user data")
    }
})


//des logout user
//route POST /api/users/logout
//@access Public
module.exports.logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    res.send({ msg: "user logged out" });
})


//des get user profile
//route GET /api/users/profile
//@access private
module.exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.send(user);
})

//des update user profile
//route PUT /api/users/profile
//@access private
module.exports.updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name,
            user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            // password: updatedUser.password
        })
    } else {
        res.status(404);
        throw new Error("user not found")
    }
})
