var appointment = require('../models/Appointment');
var mongoose = require('mongoose');
const AppointmentFactory = require('../factories/AppointmentFactory');

const AppoModel = mongoose.model("Appointment",appointment);

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
            finished: false
        });

        try {
            await newAppo.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    //listar todas as consultas recendo um booleano 
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

    async GetById(id){
        try {
            var event = await AppoModel.findOne({'_id': id});
            return event;
        } catch (err) {
            console.log(err);
        }
       
    }

}

module.exports = new AppointmentService();