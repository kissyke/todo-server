const path = require("path");
const express = require("express");
const bunyan = require("bunyan");
const service = require("./todoService.js");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const logFilePath = path.join(__dirname, "todoApi.log");

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

const log = bunyan.createLogger({
  name: "myTodoApi",
  streams: [
    {
      type: "rotating-file",
      path: logFilePath,
      period: "1m", // monthly rotation
      count: 3, // keep 3 back copies
    },
  ],
  serializers: bunyan.stdSerializers,
});

const withErrorHandling = async (operations, req, res) => {
  try {
    await operations();
  } catch (error) {
    log.error({ err: error, req: req });
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

app.get("*", (req, res) => {
  log.info({ req: req }, "Undefined route");
  res.send("Undefined route");
});

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.info(`Listening on port ${PORT}`);
});
