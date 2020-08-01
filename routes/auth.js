const express = require("express");
const {check} = require("express-validator");

const authController = require("../controllers/authController");
const auth = require("../middleware/auth")

const router = express.Router();

router.post("/",
    [
        check("email", "Email is not valid").isEmail(),
        check("password", "Password is required").not().isEmpty()
    ],
    authController.authUser
);

router.get("/",
    auth,
    authController.authenticatedUser
);

module.exports = router