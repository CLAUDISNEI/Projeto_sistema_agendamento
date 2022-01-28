//importando o express
const express = require('express');
//importando o body-parser para formulário e json
const bodyParser = require('body-parser');
//importando o mongoose para utilizar o banco de dados mongodb
const mongoose = require('mongoose');
//importando o service de consulta medica
const appointmentService = require('./services/AppointmentService');
const AppointmentService = require('./services/AppointmentService');



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


//configurando a conexao padrao do mongodb e criando o banco de dados agendamento
mongoose.connect("mongodb://localhost:27017/agendamento",{useNewUrlParser: true, useUnifiedTopology: true});

//rota principal 
app.get('/',(req, res)=>{
    //res.send("Olá!");
    res.render('index');
});

//rota para abrir a página de cadastro
app.get('/cadastro',(req, res)=>{
    res.render('create');
});

//rota para pegar os dados do formulário e realizar o cadastro no 
//banco de dados
app.post('/create', async (req,res)=>{
    
    //fazendo um destruct e capturando as informações passadas via post
    var {name, email, cpf, description, date, time} = req.body;
    
    
    var status =   await appointmentService.Create(
            name, 
            email, 
            cpf, 
            description, 
            date, 
            time   
        );
    if(status){
        //volta para página inicial
        res.redirect('/');
    }else{
        res.send("Ocorreu uma falha!");
    }
})

//rota para exibir todos os registros inclusive as consultas já finalizadas
app.get('/getcalendar',async (req,res)=>{
    
    var consultas = await AppointmentService.GetAll(true);

    res.json(consultas);

})


//iniciando o servidor
app.listen(8080,()=>{
    console.log("Servidor rodando");
});