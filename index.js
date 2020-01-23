const express = require("express");

const server = express();
//Query params = ?teste=1
//Route params = /users/1
//Request body = { "name": "Flavio", "email": "xxx@xxx"}

//usar função de leitura de dados no formato json no body da requisição / plugin/modulo
server.use(express.json());

//middleware global
server.use((req, res, next) => {
  console.time("Request");
  console.log("A requisição foi chamada");
  console.log(`O método ${req.method}; e a URL ${req.url}`);
  //return res.json()
  //bloqueia o fluxo até chamar a função next()
  next();
  console.timeEnd("Request");
});

//inserir no meio da rota
//local
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

//verifica parametro
function checkUserInArray(req, res, next) {
  //user = users[req.params.index]
  if (!users[req.params.index]) {
    return res.status(400).json({ error: "User does not exist" });
  }

  //req.user = user
  return next();
}

const users = ["Flávio", "José", "Cristiano", "Maria"];

server.get("/users/:index", checkUserInArray, (req, res) => {
  //server.get("/teste", (req, res)
  //console.log("teste");
  //----id------------
  //return res.send("Hello word!");
  //--------------------
  //return res.json({ {id}: "Hello word});
  //---------------
  //server.get("/teste/", (req, res)
  //const nome = req.query.nome;
  //return res.json({ massage: "Hello ${nome}!"});
  //---------------
  //server.get("/teste/:id", (req, res)
  //const id = req.params.id;
  //return res.json({ massage: "buscando o usuario ${id}!"});
  //-----------------
  //const { id } = req.params;
  //return res.json({ message: `buscando o usuario ${id}!` });
  //-----------------

  const { index } = req.params;
  return res.json(users[index]);
});
//CRUD - create / read / update / delete

server.get("/users", (req, res) => {
  return res.json(users);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  return res.json(users);
});

server.listen(3000);
