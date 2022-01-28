var appointment = require('../models/Appointment');
var mongoose = require('mongoose');

const AppoModel = mongoose.model("Appointment",appointment);

class AppointmentService{

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
}

module.exports = new AppointmentService();