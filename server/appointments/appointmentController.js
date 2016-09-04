/**
 * Created by Tundaey on 4/6/2016.
 */
var Appointment = require('./appointmentModel');
var Clinic = require('../clinics/clinicModel');
var Record = require('../records/recordModel');


module.exports = {

    createAppointment: function(req, res, next){
        var appointment = new Appointment();
        appointment.date = req.body.date;
        appointment.hospital_number = req.body.hospital_number;
        appointment.ward = req.body.ward._id
        if(req.body.patient){
            appointment.patient = req.body.patient;
        }else{
            Record.findOne({hospital_number: req.body.hospital_number},
            function(err, record){
                appointment.patient = req.body.patient
            })
        }
        appointment.save(function(err, a){
            if(err) return next(err)
            Record.findOne({hospital_number: req.body.hospital_number},
                function(err, record){
                    record.appointments.push(a._id);
                    record.save(function(err, r){
                        if(err) return next(err)
                        res.json({
                            message:'Appointment Booked',
                            success: true
                        })
                    })
                })
        })

    },

    getAppointments: function(req, res, next){
        Appointment.find().populate('patient ward').sort('-date')
            .exec(function(err, appointments){
                if(err) return next(err);
                console.log(appointments)
                res.json({appointments: appointments, success: true});
            })

    },

    getPendingAppointments: function(req, res, next){
        Appointment.find({status: false, ward: req.params.id}).populate('patient ward').sort('-date')
            .exec(function(err, appointments){
                if(err) return next(err);
                console.log(appointments)
                res.json({appointments: appointments, success: true});
            })

    },

    sendVitals: function(req, res, next){
        console.log(req.body)
        Appointment.findOne({_id: req.body.appointment_id},
            function(err, a){
                if(err) return next(err);
                if(!a){
                    res.status(401).json({success: true, message: 'Appointment not found'})
                }
                a.doctor = req.body.doctor._id;
                a.vitals = req.body.vitals;
                a.status = true;
                a.waiting = true;
                a.save(function(err, saved){
                    if(err) return next(err);
                    res.json({success: true, message: 'Vitals Sent'})
                })
            })
    },

    getDoctorAppointments: function(req, res, next){
        Appointment.find({status: true, waiting: true, doctor: req.decoded.id})
            .populate('patient')
            .sort('date')
            .exec( function(err, appointments){
                if(err) return next(err);
                res.json(appointments)
            })
    },

    getAppointment: function(req, res, next){
        if(req.params.id){
            Appointment.findById(req.params.id)
                .populate('patient')
                .exec(function (err, appointment) {
                    if (err) return next(err);
                    res.json({appointment: appointment, success: true})
                })
        }else{
            res.status(403).json({message: "Please provide an appointment id", success: false})
        }
    }

    /*updateAppointment: function(req, res, next){
        Appointment.findById(req.params.id, function(err, user){
            if(err) return next(err);
            if(req.body.fullname) user.fullname = req.body.fullname;
            if(req.body.role) user.role = req.body.role;
            if(req.body.username) user.username = req.body.username;
            if(req.body.password) user.username = req.body.password;
            user.save(function(err, t){
                if(err) next(err);
                res.json({message: 'User details have been updated', success: true});
            })
        })
    },

    deleteUser: function(req, res, next){
        if(req.decoded.role == 1){
            User.remove({_id: req.params.id}, function (err, user) {
                if (err) return next(err);
                res.send({message: 'Successfully deleted user', success: true})
            });
        }else{
            res.status(401).json({message: "Not Authorized to perform this action", success: false})
        }

    }*/

}

