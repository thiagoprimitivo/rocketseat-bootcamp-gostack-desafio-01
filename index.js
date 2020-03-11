const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

var contador = 1;

function contaRequisicoes(req, res, next) {

  console.log(contador);
  contador++;

  return next();
}

function checkProjectInArray(req, res, next) {
  let projectExist = false;

  projects.forEach((item)=>{
    if(item.id == req.params.id){
      projectExist = true;
    }                        
  });

  if(!projectExist) {
    return res.status(400).json({ error: 'Project does not exists' })
  }

  return next();
}

// Rota que lista todos os projetos cadastrados
server.get('/projects', contaRequisicoes, (req, res) => {
  return res.json(projects);
});

// Rota para criação de projetos
server.post('/projects', contaRequisicoes, (req, res) => {
  const { id, title } = req.body;
  
  const project = {
    id,
    title,
    "tasks": []
  };

  projects.push(project);

  return res.json(projects);
});

// Rota para criação de tarefa para um determinado projeto
server.post('/projects/:id/tasks', contaRequisicoes, checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  projects.forEach((item)=>{
    if(item.id == id){
      item.tasks.push(title);
    }                        
  });

  return res.json(projects);
});

// Rota para alteração do título do projeto
server.put('/projects/:id', contaRequisicoes, checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach((item)=>{
    if(item.id == id){
      item.title = title;
    }                        
  });

  return res.json(projects);
});

// Rota para exclusão do projeto
server.delete('/projects/:id', contaRequisicoes, checkProjectInArray, (req, res) => {
  const { id } = req.params;

  projects.forEach((item, index)=>{
    if(item.id == id){
      projects.splice(index, 1);
    }                        
  });

  return res.send();
});

server.listen(3000);