
class AppointmentFactory{

    Build(simpleAppointment){

        //vamos juntar a hora e a data para isso vamos pegar partes da 
        //data e vamos juntálos
        var day = simpleAppointment.date.getDate();
        var month = simpleAppointment.date.getMonth();
        var year = simpleAppointment.date.getFullYear();
        
        //pegando a hora para isso vamos ter que fazer um split
        //nos dois pontos sabendo que o primeiro elemento do 
        //array  são as horas e o segundo são os minutos;
        //precisamos converter as informações de horário para número
        var hour = Number.parseInt(simpleAppointment.time.split(":")[0]);
        var minutes = Number.parseInt(simpleAppointment.time.split(':')[1]);

        //criando a variavel de início da consulta, juntamos todas as
        //variáveis incluindo os segundos e milisengundos que serão zero
        var startDate = new Date(year, month, day, hour, minutes, 0, 0);

        //alterando a hora para desconsider as 3 horas à mais da UTC
        startDate.setHours(startDate.getHours() + 6  );
        
        //criando um json com os novos campos para exibir no calendario
        var appo = {

            id: simpleAppointment. _id,
            title: simpleAppointment.name +" - "+ simpleAppointment.description,
            start: startDate,
            end: startDate,
            notified: simpleAppointment.notified
        }

        return appo;

    }

}

module.exports = new AppointmentFactory();