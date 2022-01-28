//importando o express
const express = require('express');
//importando o body-parser para formulário e json
const bodyParser = require('body-parser');
//importando o mongoose para utilizar o banco de dados mongodb
const mongoose = require('mongoose');


//criando a instancia do express em um app
const app = express();

//configurando o uso de arquivos estáticos para a página do calendar utilizar
//o css e o javascript
app.use(express.static('public'));

//configurano o app pra utilizar o express em formulários e o json
app.use(express.urlencoded({extended: true} ));
app.use(express.json());

//configurando o framework da view engine
app.set('view engine','ejs');


//configurando a conexao padrao do mongodb
mongoose.connect("mongodb://localhost:27017/agendamento",{useNewUrlParser: true, useUnifiedTopology: true});

//rota principal 
app.get('/',(req, res)=>{
    res.send("Olá!");
});

//rota de cadastro
app.get('/cadastro',(req, res)=>{
    res.render('create');
});


//iniciando o servidor
app.listen(8080,()=>{
    console.log("Servidor rodando");
});