const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({path: "var.env"})

const User = require("../models/User");

exports.authUser = async (req, res) => {
    // Verify errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Verify if user exists
    const {email, password} = req.body;
    const user = await User.findOne({email});

    // If user doesn't exist
    if (!user) {
        return res.status(401).json({msg: "Invalid email."});
    }

    // Verify password and auth user
    if (bcrypt.compareSync(password, user.password)) {
        // Create JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.SECRET, {
            expiresIn: "2 days"
        });

        res.json({token});

    } else {
        res.status(401).json({msg: "Incorrect password"});
    }

}

exports.authenticatedUser = (req, res) => {
    const {user} = req;
    return res.json({user});
}