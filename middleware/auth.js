const jwt = require("jsonwebtoken");
require("dotenv").config({path: "var.env"})

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        return res.status(403).json({msg: "Missing auth header"});
    }

    try {
        // Get token
        const token = authHeader.split(" ")[1];

        // verify jwt
        req.user = jwt.verify(token, process.env.SECRET);
    } catch (e) {
        return res.status(403).json({msg: "Invalid auth header"});
    }

    return next();
}