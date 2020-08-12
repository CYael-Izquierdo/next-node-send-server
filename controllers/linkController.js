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
        return res.status(400).json({msg: "there was an unexpected error."});
    }
}

exports.allLinks = async (req, res) => {
    try {
        const links = await Links.find({}).select("url -_id");
        res.json({links});
    } catch (e) {
        console.log(e)
        res.status(400).json({msg: "there was an issue"});
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

    const {name, originalName} = link;

    // if link exists
    res.json({file: name, originalName});
}

exports.hasPassword = async (req, res, next) => {
    const {url} = req.params;

    // Verify that link exists
    const link = await Links.findOne({url});

    if (!link) {
        return res.status(404).json({msg: "The link does not exist"});
    }

    if (link.password) {
        return res.json({password: true, url: link.url, originalName: link.originalName});
    }

    next();
}

exports.validatePassword = async (req, res, next) => {
    const {url} = req.params;
    const {password} = req.body;

    const link = await Links.findOne({url});

    if (bcrypt.compareSync(password, link.password)) {
        next();
    } else {
        return res.status(401).json({msg: "Incorrect password"});
    }



}
