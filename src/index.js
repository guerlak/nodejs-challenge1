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
  return response.status(401).json({ error: 'user not found' })
}

app.post('/users', (request, response) => {
  // Complete aqui

  const { name, username } = request.body;

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
  return response.status(200).json(user.todos)

});

app.post('/todos', checkExistUser, (request, response) => {
  // Complete aqui

  const { user } = request;
  const { title, deadline, created_at } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at,
  }

  user.todos.push(todo)

  return response.status(201).json({ ok: "Todo added" })
});

app.put('/todos/:id', checkExistUser, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checkExistUser, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checkExistUser, (request, response) => {
  // Complete aqui
});

module.exports = app;