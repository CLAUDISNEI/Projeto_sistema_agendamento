var appointment = require('../models/Appointment');
var mongoose = require('mongoose');

const AppoModel = mongoose.model("Appointment",appointment);

class AppointmentService{

    //método salvar um registro
    async Create(name, email, description, cpf, date, time){
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
            return await AppoModel.find({'finished': false});
        }


    }

}

module.exports = new AppointmentService();