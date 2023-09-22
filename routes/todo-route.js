const express = require("express");
const db = require("../database/db");
const createError = require("../utils/create-error");
const router = express.Router();

//create todo
//Method: Post, Path: /create-todo
//Data: title, userId,completed

router.post("/", async (req, res, next) => {
  try {
    //read body
    const { title, userId, completed } = req.body;
    //validate user is exist or not
    const result = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (result[0].length === 0) {
      // return res.status(400).json({ message: "user not found!" });
      return next(createError(400, "user not found!"));
    }
    await db.query(
      "INSERT INTO todos (title,completed,user_id) VALUES (?,?,?)",
      [title, completed, userId]
    );
    res.status(200).json({ message: "create todo successfully!" });
  } catch (err) {
    // res.status(err.statusCode || 500).json({ message: err.message });
    next(createError(500, "internal server error"));
  }
});

//get todo
//Method: get, Path: /get-todo
//Data: useable => params / query
//Data: searchTitle, userId(query)

router.get("/", async (req, res, next) => {
  try {
    //req.query
    const { searchTitle, userId } = req.query;
    if (searchTitle !== undefined && userId !== undefined) {
      const result = await db.query(
        "SELECT * FROM todos WHERE title = ? AND user_id =?",
        [searchTitle, userId]
      );
      return res.status(200).json({ resultTodo: result[0] });
    }
    if (searchTitle !== undefined) {
      const result = await db.query("INSERT * FROM todos WHERE title =?", [
        searchTitle,
      ]);
      return res.status(200).json({ resultTodo: result[0] });
    }
    if (userId !== undefined) {
      const result = await db.query("SELECT * FROM todos WHERE user_id = ?", [
        userId,
      ]);
      return res.status(200).json({ resultTodo: result[0] });
    }

    //userId & searchTitle not exist
    const result = await db.query("SELECT * FROM todos");
    res.status(200).json({ resultTodo: result[0] });
  } catch {
    // res.status(500).json({ message: "internal server error" });
    next(createError(500, "internal server error"));
  }
});

//delete todo
//Method: delete, Path: /delete-todo/:idToDelete (param :)
//Data: idToDelete

router.delete("/delete-todo/:idToDelete", async (req, res, next) => {
  try {
    //read path though parameter
    const { idToDelete } = req.params; //{idToDelete:value}
    //find todos is exist
    const result = await db.query("SELECT * FROM todos WHERE id = ?", [
      idToDelete,
    ]);
    if (result[0].length === 0) {
      // return res
      //   .status(400)
      //   .json({ message: "todo with this id is not found" });
      return next(createError(400, "todo with this id is not found"));
    }
    await db.query("DELETE FROM todos WHERE id = ?", [idToDelete]);
    res.status(200).json({ message: "delete successfully!" });
  } catch (err) {
    // res.status(500).json({ message: "internal server error" });
    next(createError(500, "internal server error"));
  }
});

module.exports = router;
