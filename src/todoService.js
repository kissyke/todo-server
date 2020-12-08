const path = require("path");
const Datastore = require("nedb");

const db = new Datastore({
  filename: path.join(__dirname, "todos.db"),
  autoload: true,
});

function listTodos() {
  return new Promise((resolve, reject) => {
    db.find({}, (error, docs) => {
      if (error) {
        reject(error);
      } else {
        resolve(docs);
      }
    });
  });
}

function addTodo(newTodo) {
  return new Promise((resolve, reject) => {
    db.insert(newTodo, (error, newDoc) => {
      if (error) {
        reject(error);
      } else {
        resolve(newDoc);
      }
    });
  });
}

function updateTodo(id, todo) {
  return new Promise((resolve, reject) => {
    db.update({ _id: id }, todo, {}, (error) => {
      if (error) {
        reject(error);
      } else {
        db.findOne({ _id: id }, (error, updated) => {
          if (error) {
            reject(error);
          } else {
            resolve(updated);
          }
        });
      }
    });
  });
}

function deleteTodo(id) {
  return new Promise((resolve, reject) => {
    db.remove({ _id: id }, (error, numRemoved) => {
      if (error) {
        reject(error);
      } else {
        resolve(numRemoved);
      }
    });
  });
}

module.exports = {
  listTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
