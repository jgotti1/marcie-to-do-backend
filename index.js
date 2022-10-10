const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbPernToDo = require("./db");
const PORT = process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());

//************ROUTES**********

//create to do
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await dbPernToDo.query("INSERT INTO todo (description) VALUES($1) RETURNING * ", [description]);
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const toDo = await dbPernToDo.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
    res.json(toDo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// get all to dos
app.get("/todos", async (req, res) => {
  try {
    const allToDos = await dbPernToDo.query("SELECT * FROM todo");
    res.json(allToDos.rows);
  } catch (error) {
    console.log(error.message);
  }
});
//delete to do
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTodo = await dbPernToDo.query("DELETE FROM todo WHERE todo_id = $1", [id]);
    res.json(`${deleteTodo} delete complete!`);
  } catch (error) {
    console.log(error.message);
  }
});

//update to do
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await dbPernToDo.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
    res.json(`${updateTodo} update complete!`);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});
