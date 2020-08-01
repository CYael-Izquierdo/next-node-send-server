const jwt = require("jsonwebtoken");
require("dotenv").config({path: "var.env"})

exports.getAuthUser = (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        // Get token
        const token = authHeader.split(" ")[1];

        // verify jwt
        req.user = jwt.verify(token, process.env.SECRET);
    } catch (e) {
        console.log(e);
        console.log("Invalid JWT");
    }

    return next();
}