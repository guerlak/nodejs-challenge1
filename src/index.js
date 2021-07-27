const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checkExistUser(request, response, next) {
  const { username } = request.headers;

  const usr = users.find(u => u.username === username);

  if (usr) {
    //put CST into req
    request.user = usr;
    return next();
  }
  return response.status(404).json({ error: 'user not found' })
}

app.post('/users', (request, response) => {
  // Complete aqui

  const { name, username } = request.body;

  const usr = users.find(u => u.username === username);

  if (usr) {
    return response.status(400).json({ error: "User exists" })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checkExistUser, (request, response) => {
  // Complete aqui

  const { user } = request;
  return response.json(user.todos)

});

app.post('/todos', checkExistUser, (request, response) => {
  // Complete aqui

  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', checkExistUser, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const { title, deadline } = request.body;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo not found" })
  }

  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).json(todo)
});

app.patch('/todos/:id/done', checkExistUser, (request, response) => {
  // Complete aqui

  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo not found" })
  }

  todo.done = true;

  return response.status(201).json(todo)
});

app.delete('/todos/:id', checkExistUser, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "todo not found" })
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;