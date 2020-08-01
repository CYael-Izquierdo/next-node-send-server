const express = require("express");
const {check} = require("express-validator");

const {newUser} = require("../controllers/userController");

const router = express.Router();

router.post("/",
    [
        check("name", "User name is required").not().isEmpty(),
        check("email", "Add a valid email").isEmail(),
        check("password", "The password must have at least 6 characters").isLength({min: 6}),
    ],
    newUser
);

module.exports = router;