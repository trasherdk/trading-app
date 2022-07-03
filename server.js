// importing required liberary
const express = require("express");
const cors = require("cors");
const connect = require("./src/configs/db");
require("dotenv").config();

// importing user controller
const userController = require("./src/controllers/userControl");

const app = express();

// middleware for cors and getting json data
app.use(express.json());
app.use(cors());

app.use("/auth", userController);

// app.listen to start server
app.listen(process.env.PORT || 8080, async (req, res) => {
  try {
    console.log("==> Server started", process.env.PORT || 8080);
    await connect();
  } catch (error) {
    console.log("==> Server start ERROR", error);
  }
});
