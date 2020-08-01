const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");

const User = require("../models/User");

exports.newUser = async (req, res) => {
    // Express validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Verify if user is already registered
    const {email, password} = req.body;
    let user = await User.findOne({email});

    if (user) {
        return res.status(409).json({msg: "The email is already registered with another account"});
    }

    // Create new user
    user = new User(req.body);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Saving user
    try {
        await user.save();
        res.status(201).json({msg: "User successfully created"});
    } catch (e) {
        console.log(e);
        res.status(400).json({msg: "There was an unexpected error"});
    }

}