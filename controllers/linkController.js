const {validationResult} = require("express-validator");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const Links = require("../models/Link");

exports.newLink = async (req, res, next) => {
    // Express validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Create link object
    const {originalName, name} = req.body;

    const link = new Links();
    link.url = shortid.generate();
    link.name = name;
    link.originalName = originalName;

    // if user is authenticated
    if (req.user) {
        const {password, downloads} = req.body;

        // Set downloads
        if (downloads) link.downloads = downloads;

        // Set password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }

        // Set author
        link.author = req.user.id;
    }

    // Save link in DB
    try {
        await link.save();
        return res.json({msg: `${link.url}`})
    } catch (e) {
        console.log(e);
    }
}

// Get link
exports.getLink = async (req, res, next) => {
    // get url
    const {url} = req.params;

    // Verify that link exists
    const link = await Links.findOne({url});

    if (!link) {
        return res.status(404).json({msg: "The link does not exist"})
    }

    const {name, downloads} = link;

    // if link exists
    res.json({file: name});

    // downloads === 1, delete from db and delete file
    if (downloads === 1) {
        // Delete file
        req.filetodelete = name;

        // Delete file from
        await Links.findOneAndRemove({url});
        next();

    } else {
        // download > 1, decrease
        link.downloads--;
        await link.save();
    }
}
