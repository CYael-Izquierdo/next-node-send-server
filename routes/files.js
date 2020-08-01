const express = require("express");

const fileController = require("../controllers/fileController");
const {getAuthUser} = require("../middleware/user")

const router = express.Router();

router.post("/",
    getAuthUser,
    fileController.uploadFile
);

router.delete("/:id",
    fileController.deleteFile
);

module.exports = router;