const express = require("express");
const db = require("../database/db");
const createError = require("../utils/create-error");
const router = express.Router();

//Login
//Method: Post, Path: /login
//Data: username ,password (request)

router.post("/login", async (req, res, next) => {
  try {
    //read body
    //sending data by u.name / pw
    const { username, password } = req.body;
    //find user /w username & password
    const result = await db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (result[0].length === 0) {
      // return res.status(400).json({ message: "invalid username or password" });
      return next(createError(400, "invalid username or password"));
    }
    {
      res.status(200).json({ message: "login successfully!" });
    }
  } catch (err) {
    // res.status(500).json({ message: "internal server error" });
    next(createError(500, "internal server error"));
  }
});

//register
//BODY,QUERY,PARAMETER
//Method : post , Path : /user/register
//Data : username, password (request body)

router.post("/register", async (req, res, next) => {
  try {
    //read body
    const { username, password } = req.body;
    //VALIDATE DATA
    //find exist username
    const result = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    console.log(result);
    if (result[0].length > 0) {
      // return res.status(400).json({ message: "username has been used" });
      return next(createError(400, "username has been used"));
    }
    await db.query("INSERT INTO users(username,password) VALUES (?,?)", [
      username,
      password,
    ]);
    res.status(200).json({ message: "successfully register!" });
  } catch (err) {
    // res.status(500).json({ message: "internal server error" });
    next(createError(500, "internal server error"));
  }
});

//Changes password
//Method: Put,Patch
//Path: /change-password
//Data: username , newPassword

router.put("/change-password", async (req, res, next) => {
  try {
    //read body
    const { username, newPassword } = req.body;
    //validate username exist
    const result = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (result[0].length === 0) {
      // return res.status(400).json({ message: "username not found!" });
      return next(createError(400, "username not found!"));
    }
    await db.query("UPDATE users SET password = ?", [newPassword, username]);
    res.status(200).json({ message: "update new password successfully!" });
  } catch (err) {
    // res.status(500).json({ message: "internal server error" });
    next(createError(500, "internal server error"));
  }
});

module.exports = router;
