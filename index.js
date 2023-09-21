const express = require("express");
const mysql2 = require("mysql2/promise");

//application object
const app = express();

const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "Paritasri27",
  database: "mysql_todo_list",
  connectionLimit: 20,
});

app.use(express.json());

//validate exist email
//app.get('/validate-emil',(req,res,next)=>{})

//Login
//Method: Post, Path: /login
//Data: username ,password (request)

app.post("/login", async (req, res, next) => {
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
      return res.status(400).json({ message: "invalid username or password" });
    }
    {
      res.status(200).json({ message: "login successfully!" });
    }
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
});

//BODY,QUERY,PARAMETER
//register
//Method : post , Path : /register
//Data : username, password (request body)

app.post("/register", async (req, res, next) => {
  try {
    //read body
    const { username, password } = req.body;
    //VALIDATE DATA
    const db = mysql2.createPool({
      host: "localhost",
      user: "root",
      password: "Paritasri27",
      database: "mysql_todo_list",
      connectionLimit: 20,
    });
    //find exist username
    const result = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    console.log(result);
    if (result[0].length > 0) {
      return res.status(400).json({ message: "username has been used" });
    }

    // await db.query("INSERT INTO users(username,password) VALUES (?,?)", [
    //   username,
    //   password,
    // ]);
    // res.status(201).json({ message: "successfully register!" });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
});

//Changes password
//Method: Put,Patch
//Path: /change-password
//Data: username , newPassword

app.put("/change-password", async (req, res, next) => {
  try {
    //read body
    const { username, newPassword } = req.body;
    //validate username exist
    const result = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (result[0].length === 0) {
      return res.status(400).json({ message: "username not found!" });
    }
    await db.query("UPDATE users SET password = ?", [newPassword, username]);
    res.status(200).json({ message: "update new password successfully!" });
  } catch {
    res.status(500).json({ message: "internal server error" });
  }
});

//create todo
//Method: Post, Path: /create-todo
//Data: title, userId,completed

app.post("/create-todo", async (req, res, next) => {
  try {
    //read body
    const { title, userId, completed } = req.body;
    //validate user is exist or not
    const result = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (result[0].length === 0) {
      return res.status(400).json({ message: "user not found!" });
    }
    await db.query(
      "INSERT INTO todos (title,completed,user_id) VALUES (?,?,?)",
      [title, completed, userId]
    );
    res.status(200).json({ message: "create todo successfully!" });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
});

//get todo
//Method: get, Path: /get-todo
//Data: useable => params / query
//Data: searchTitle, userId(query)

app.get("/get-todo", async (req, res, next) => {
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
    res.status(500).json({ message: "internal server error" });
  }
});

//delete todo
//Method: delete, Path: /delete-todo/:idToDelete (param :)
//Data: idToDelete

app.delete("/delete-todo/:idToDelete", async (req, res, next) => {
  try {
    //read path though parameter
    const { idToDelete } = req.params; //{idToDelete:value}
    //find todos is exist
    const result = await db.query("SELECT * FROM todos WHERE id = ?", [
      idToDelete,
    ]);
    if (result[0].length === 0) {
      return res
        .status(400)
        .json({ message: "todo with this id is not found" });
    }
    await db.query("DELETE FROM todos WHERE id = ?", [idToDelete]);
    res.status(200).json({ message: "delete successfully!" });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
});

app.listen(8888, () => console.log("server running on port 8888"));

// res.json({ message: "REGISTER" });
//by destrucring
//read body
// const { username, password } = req.body;

//VALIDATE DATA : Password must contain at least on uppercase
//in case Validate fail : send any message to the client
//res.status(400).json({ message: 'Password must contain at least one uppercase!' })
//END VALIDATE

// SAVE DATA TO DATABASE
//MYSQL 2 connect to mysql server and persist data to user table
//   const db = mysql2.createPool({
//     host: "localhost",
//     user: "root",
//     password: "Paritasri27",
//     database: "mysql_todo_list",
//     connectionLimit: 20,
//   });
//   db.query("INSERT INTO users(username,password) VALUES (?,?)", [
//     username,
//     password,
//   ]);
//   res.status(201).json({ message: "successfully register!" });
// });

// app.listen(8888, () => console.log("server running on port 8888"));
