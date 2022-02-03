const nodemailer = require('nodemailer');
//importando configuraçãoes
const config = require('./config');

//criando um transporting 
let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth:{
        user: config.user,
        pass: config.pass
    }
});

//criando as configurações do email que será utilizado
transporter.sendMail({
    from: "Claudisnei <testdevclaudisnei@gmail.com>",
    to: "claudisneibello@gmail.com",
    subject: "Oi estou configurando o envio de email 2",
    text:"Esta é a mensagem que iremos passar no email para o usuário",
    html:"Olá eu sou Claudisnei estou aprendendendo o <a href='https://guiadoprogramador.com'>nodemaile</a> é muito legal"

}).then(message =>{
    console.log(message);
}).catch(err =>{
    console.log(err);
})