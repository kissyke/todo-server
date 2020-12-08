const express = require("express");
const service = require("./todoService.js");

const app = express();
const PORT = 4000;

app.use(express.json());

const withErrorHandling = async (operations, res) => {
  try {
    await operations();
  } catch (error) {
    res.status(500).json({ message: "Error during operation: ", error });
  }
};

app.get("/api/todos", async (req, res) => {
  withErrorHandling(async () => {
    const todoList = await service.listTodos();
    res.status(200).json(todoList);
  }, res);
});

app.post("/api/todos", async (req, res) => {
  withErrorHandling(async () => {
    const todo = await service.addTodo(req.body);
    res.status(200).json(todo);
  }, res);
});

app.put("/api/todos/:id", async (req, res) => {
  withErrorHandling(async () => {
    const todo = await service.updateTodo(req.params.id, req.body);
    res.status(200).json(todo);
  }, res);
});

app.delete("/api/todos/:id", async (req, res) => {
  withErrorHandling(async () => {
    const numRemoved = await service.deleteTodo(req.params.id);
    res.status(200).json(numRemoved);
  }, res);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
