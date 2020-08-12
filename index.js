const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Create server
const app = express();

// Connect db
connectDB();

// Enable CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOptions));

// App port
const port = process.env.PORT || 4000;

// Enable read body values
app.use(express.json());

// Enable public folder
app.use(express.static("uploads"))

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/links", require("./routes/links"));
app.use("/api/files", require("./routes/files"));

// Start app
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}.`)
})
