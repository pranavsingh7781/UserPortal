const { User } = require("../model/usermodles.js");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

// Register user
exports.userSignUp = async (req, res) => {
    const { name, username, email, password, bio } = req.body;
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            bio
        });

        res.status(201).send({
            msg: "SignUp Success",
            user: newUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ msg: "User with this email or username already exists" });
        }
        res.status(500).send({ msg: error.message });
    }
};

// Login user
exports.userLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const getuserData = await User.findOne({ username }).select("+password");
        if (getuserData) {
            const isPasswordValid = await bcrypt.compare(password, getuserData.password);
            if (isPasswordValid) {
                const token = await getuserData.jwtToken();
                const cookieOption = {
                    maxAge: 24 * 60 * 60 * 1000, // 24hr
                    httpOnly: true // cookie cannot be accessed or modified by client-side scripts
                };

                res.cookie("token", token, cookieOption);
                res.status(200).json({
                    success: true,
                    data: getuserData
                });
            } else {
                res.status(401).send({ msg: "Password is Incorrect, Try Again!" });
            }
        } else {  
            res.status(404).send({ msg: "No Account Found Associated with this username" });
        }
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

// Get user details
exports.getUserDetails = async (req, res) => {
    const { username } = req.user;

    try {
        const userData = await User.findOne({ username });
        if (!userData) {
            return res.status(404).send({ msg: "User not found" });
        }
        res.status(200).send({
            msg: "Success",
            data: userData
        });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};
