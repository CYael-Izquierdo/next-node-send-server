const shortid = require("shortid");
const multer = require("multer");
const fs = require("fs");

const MAX_SIZE_USER = 1024 * 1024 * 10;
const MAX_SIZE_DEFAULT = 1024 * 1024;

exports.uploadFile = async (req, res) => {

    const multerConfig = {
        limits: {fileSize: req.user ? MAX_SIZE_USER : MAX_SIZE_DEFAULT},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + "/../uploads")
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf("."));
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }

    const upload = multer(multerConfig).single("file")

    upload(req, res, async (error) => {
        if (!error) {
            return res.json({file: req.file.filename});
        } else {
            if (error.code === "LIMIT_FILE_SIZE") {
                if (req.user) {
                    return res.status(400).json({msg: `The file exceeds the maximum size, ${MAX_SIZE_USER / (1024 * 1024)} MB`});
                } else {
                    return res.status(400).json({msg: `The file exceeds the maximum size, ${MAX_SIZE_DEFAULT / (1024 * 1024)} MB, sign up to increase the limit.`});
                }
            } else {
            }
        }
    });
}

exports.deleteFile = async (req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.filetodelete}`);
        console.log(`${req.filetodelete} deleted.`);
    } catch (e) {
        console.log(e);
    }
}