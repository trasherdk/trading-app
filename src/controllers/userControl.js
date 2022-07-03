// importing required liberaries
const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

// importing model and fileupload functions
const { upload, uploadSingle } = require("../Middlewares/file-upload");
const User = require("../models/userModel");

const router = express.Router();

// newToken function to make jwt token of user
// I hided JWT key for my project
// If you are here to try application you can add you own jwt key for local server

const newToken = (user) => {
  return jwt.sign({ user }, `${process.env.JWT__KEY}`);
};

// router.post for posting new user to database
router.post("/register", uploadSingle("profilePhoto"), async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).lean().exec();

    if (user)
      return res.status(400).send({
        error: true,
        token: "Something went wrong! Check your email or password",
      });

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profilePhoto: req.file.path,
    });

    const token = newToken(user);

    console.log("==> New user registered", req.body.email);
    res.status(200).send({ error: false, token });
  } catch (error) {
    console.log("==> User registeration ERROR for", req.body.email);
    return res.status(500).send({ error: true, token: "" });
  }
});

router.get("", async (req, res) => {
  try {
    const user = await User.find().lean().exec();

    console.log("==> Getting all user");
    res.status(200).send({ error: false, token: user });
  } catch (error) {
    console.log("==> getting all user ERROR");
    res.status(500).send({ error: true, token: "Getting all user Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();

    fs.unlinkSync(`${user.profilePhoto}`);

    const deleteuser = await User.findByIdAndDelete(req.params.id)
      .lean()
      .exec();

    console.log("==> deleted user of Id :- ", req.params.id);
    res.status(200).send({ error: false, token: "User deleted" });
  } catch (error) {
    console.log("==> deleting user ERROR of Id :- ", error);
    res.status(500).send({ error: true, token: "server deleting error" });
  }
});

// exports router
module.exports = router;
