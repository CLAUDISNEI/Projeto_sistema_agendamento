//importando o express
const express = require('express');
//importando o body-parser para formulário e json
const bodyParser = require('body-parser');
//importando o mongoose para utilizar o banco de dados mongodb
const mongoose = require('mongoose');
//importando o service de consulta medica
//const appointmentService = require('./services/AppointmentService');
const AppointmentService = require('./services/AppointmentService');
//importando o arquivo de configuração com variáveis padrão.
const config = require('./config/config');


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
    
    
    var status =   await AppointmentService.Create(
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
    
    var appointments = await AppointmentService.GetAll(false);

    res.json(appointments);

})

//rota para carregar um registro em uma página paa edição.
app.get('/event/:id', async(req, res)=>{
    /*testando
    console.log(await AppointmentService.GetById(req.params.id));
    res.json({id: req.params.id});
    */
   var appointment = await AppointmentService.GetById(req.params.id);
   res.render('event',{appo: appointment});
});

//rota para finalizar a consulta
app.post('/finished', async(req, res)=>{
    var id = req.body.id;
    var result = await AppointmentService.appointmentFinished(id);

    res.redirect('/');
});

//rota para exibir dos os registros 
app.get('/list',async (req,res)=>{
    var list = await AppointmentService.GetAll(true);
    res.render('list',{list});
})

//rota para exibir a buscar por email ou cpf
app.get('/searchresult',async(req, res)=>{
    var query = req.query.search;
    var list = await AppointmentService.Search(query);
    //res.json(search);
    res.render('list',{list});
});


//setando um tempo para executar a consulta ao banco de dados
setInterval( async () => {
    console.log("Olá");
    AppointmentService.sendNotification();
}, config.taskTime);


//iniciando o servidor
app.listen(8080, ()=>{
    console.log("Servidor rodando");

});