const express = require("express");
const db = require("./database/db");
// const createError = require("./utils/create-error");
const userRoute = require("./routes/user-route");
const errorMiddleware = require("./middlewares/error");
const todoRoute = require("./routes/todo-route");
//application object
const app = express();

app.use(express.json());

app.use("/users", userRoute);
app.use("/todos", todoRoute);

//validate exist email
//app.get('/validate-emil',(req,res,next)=>{})

app.use(errorMiddleware);
app.listen(8888, () => console.log("server running on port 8888"));

//Group them w/ the same feature! by ROUTE
//register, login, password

// /register => /user/register
// /login => /user/login
// /change-password => /user/change-password

//create, get, delete todo
// /create-todo => /todo
// /delete-to => /todo/:idToDelete
// /get-todo => /todo GET

//in the end only this app.use will be the less
// app.use("/user", userRoute);
// app.use("/todo", todoRoute);

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
