const mongoose = require("mongoose");
require("dotenv").config({path: "var.env"});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
           useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("DB Connected")
    } catch (e) {
        console.log("There was en error connecting with DB", e);
        process.exit(1);
    }
}

    module.exports = connectDB;