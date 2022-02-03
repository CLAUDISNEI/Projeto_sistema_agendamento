var appointment = require('../models/Appointment');
var mongoose = require('mongoose');
const AppointmentFactory = require('../factories/AppointmentFactory');

const AppoModel = mongoose.model("Appointment",appointment);

//importando o nodeailer para envio de emails
const mailer = require('nodemailer');
//importando arquivo de configuração
const config = require('../config/config');

class AppointmentService{

    //método salvar um registro
    async Create(name, email, cpf, description, date, time){
        var newAppo = new AppoModel({
            name: name,
            email: email,
            description: description,
            cpf: cpf,
            date: date,
            time: time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    //método para listar todas as consultas recendo um booleano 
    async GetAll(showFinished){

        //mostrando todas as consultas
        if(showFinished){
            return await AppoModel.find();
        }else{
            //mostrando as consultas que ainda não foram finalizadas.
            //a variavel apps irá receber todos os registros que ainda
            //não foram finalizados.
            var appos = await AppoModel.find({'finished': false});

            //array que receberá os registros com o formato ideal para 
            //mostrar no calendario.
            var appointments = [];

            //faremos um laço em cada registro
            //e iremos adicionar 
            appos.forEach(appointment => {
                    
                    if(appointment.date != undefined){
                        appointments.push(AppointmentFactory.Build(appointment));
                    }
            })

            return appointments;
        }

    }

    //método para localizar um registro através de um id passado por parâmetro
    async GetById(id){
        try {
            var event = await AppoModel.findOne({'_id': id});
            return event;
        } catch (err) {
            console.log(err);
        }
       
    }

    //método para alterar o campo booleando de consulta finalizada
    async appointmentFinished(id){
        var msg;
        try {
            var result = await AppoModel.findByIdAndUpdate(id,{finished: true});
            if(result){
                console.log("Consulta finalizada");
                msg = "Constulta finalizada";
                return {status: true, msg: msg};
            }else{
                console.log("Consulta não encontrada");
                msg = "Consulta não localizada";
                return {status: false, msg: msg};
            }
        } catch (err) {
            console.log("Erro ao finalizar consulta: "+ error);
            return {status: false, msg: err};
        }
    }

    //metodo que irá localizar um registro através do cpf ou o email do usuário
    async Search(query) {
        try {
            var result = await AppoModel.find().or([
                {email: query},
                {cpf: query}
            ]);
            if(result.length>0){
                return result;
            }else{
                return {status: false, msg: "Paciente não localizado" };
            }
        } catch (err) {
            return {status: false, msg: err};
        }
    }
    
    //metodo para enviar a notificação ao paciente
    async sendNotification(){
        var appos = await this.GetAll(false);
       // var time = Date.now();

        //criação da configuração do nodemailer para envio de email
        var transporter = mailer.createTransport({
            host: config.host,
            port: config.port,
            auth:{
                user: config.user,
                pass: config.pass
            }
        });

        appos.forEach(async appo =>{

            //date recebe a data do banco de dados
            var date = appo.start.getTime();

            //corresponde ao tempo de antecedência para envio da notificação
            var hour = 1000 * 60 * 60 * 1; 

            //gap é diferença entre a data do sistema menos a data atual
            var gap = date - Date.now();

            if(gap <= hour){
                //console.log(appo.title);
                //console.log("Mand a not!");
                //iremos verificar se o paciente já foi notificado
                if(!appo.notified){
                   
                    await AppoModel.findByIdAndUpdate(appo.id, {notified: true});

                    //envio de email
                    transporter.sendMail({
                        from:"Claudisnei <testdevclaudisnei@gmail.com",
                        to: appo.email,
                        subject: "Alerta do horário da consulta",
                        text: "A sua consulta está marcada e irá acontecer em 1h"
                    }).then(()=>{
                        console.log("Email enviado para " + appo.email);
                    }).catch(err=>{
                        console.log(err);
                    })                  
                }
            }
        });


        //console.log(time);
      //   console.log(appos);
    }
}

module.exports = new AppointmentService();