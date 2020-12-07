//Please use Postman to manage data with the features below
const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());
const DEFAULT_PRIORITY = 3;
const DEFAULT_DONE = false;

//Get all todos
app.get("/todos", (req, res) => {
  try {
    var data = JSON.parse(fs.readFileSync("data.json"));
    data.todos = data.todos.filter((c) => c.done != true);
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});
//Get a todo with the given id
app.get("/todos/:id", (req, res) => {
  try {
    //Collect data and get only the undone todos
    const data = JSON.parse(fs.readFileSync("data.json"));
    data.todos = data.todos.filter((c) => c.done != true);
    //Get the todo with given id
    const todo = data.todos.find((c) => c.id === parseInt(req.params.id));
    if (!todo) return res.send("There is no todo with the given id...");
    res.send(todo);
  } catch (err) {
    console.error(err.message);
  }
});
//Create a new todo
app.post("/todos", (req, res) => {
  try {
    //User can only enter text and it should be a string
    if (
      !(typeof req.body.text === "string") ||
      Object.keys(req.body).length != 1
    )
      return res.send(
        "You can only enter text info and text can only be a string..."
      );
    const data = JSON.parse(fs.readFileSync("data.json"));
    //Get the last todo id in order to create a new one with unique id
    const lastTodo = data.todos[data.todos.length - 1];
    const newTodoId = (() => {
      if (lastTodo != null) return lastTodo.id + 1;
      else return 1;
    })();

    const { text } = req.body;
    const newTodo = {};
    newTodo.text = text;
    newTodo.priority = DEFAULT_PRIORITY;
    newTodo.done = DEFAULT_DONE;
    newTodo.id = newTodoId;
    //Add new todo to the data
    data.todos.push(newTodo);
    writeDataToJSON(data);
    res.send(newTodo);
  } catch (err) {
    console.error(err.message);
  }
});
//Updating a todo with the given id
app.put("/todos/:id", (req, res) => {
  try {
    //Collect data and get only the undone todos
    const data = JSON.parse(fs.readFileSync("data.json"));
    data.todos = data.todos.filter((c) => c.done != true);
    //Get the todo to be updated with the given id
    const updateTodo = data.todos.find((c) => c.id === parseInt(req.params.id));
    if (!updateTodo) return res.send("There is no todo with the given id...");
    //User can only enter the necessary variables with their types
    if (
      !(
        typeof req.body.text === "string" &&
        req.body.priority >= 1 &&
        req.body.priority <= 5 &&
        typeof req.body.done === "boolean"
      )
    ) {
      return res.send(
        "Correct data types are : \n text => string \n priority => number between 1-5 \n done => boolean"
      );
    }
    const { text } = req.body;
    const { priority } = req.body;
    const { done } = req.body;

    updateTodo.text = text;
    updateTodo.priority = priority;
    updateTodo.done = done;

    writeDataToJSON(data);
    res.send(updateTodo);
    //A finished todo gets done for 5 min till it is added back to the list
    if (done)
      setTimeout(() => {
        updateTodo.done = false;
        writeDataToJSON(data);
      }, 5 * 60 * 1000);
  } catch (err) {
    console.error(err.message);
  }
});
//Delete a todo with the given id
app.delete("/todos/:id", (req, res) => {
  //Collect data and get only the undone todos
  const data = JSON.parse(fs.readFileSync("data.json"));
  data.todos = data.todos.filter((c) => c.done != true);
  //Get the todo to be updated with the given id
  const deleteTodo = data.todos.find((c) => c.id === parseInt(req.params.id));
  if (!deleteTodo) return res.send("There is no todo with the given id...");

  //Removing the todo from the json file
  const indexOfDeleted = data.todos.indexOf(deleteTodo);
  data.todos.splice(indexOfDeleted, 1);
  writeDataToJSON(data);
  res.send(deleteTodo);
});
//Function to write the current info to json file
function writeDataToJSON(data) {
  //Turning data to string with a small touch to look organized
  var stringData = JSON.stringify(data, null, 2);
  fs.writeFileSync("data.json", stringData);
}
//App working on either a set port or port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});

module.exports = app;
