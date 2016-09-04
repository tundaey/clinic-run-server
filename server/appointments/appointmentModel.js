/**
 * Created by Tundaey on 4/6/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var appointmentSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Record'},
    date: {type: Date},
    ward: {type: mongoose.Schema.Types.ObjectId, ref: 'Ward'},
    hospital_number: {type: String},
    status: {type: Boolean, default: false},
    waiting: {type: Boolean, default: false},
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    vitals: {
        height: {type: String},
        weight: {type: String},
        hc: {type: String},
        bp: {type: String},
        pulse: {type: String},
        temp: {type: String},
        respiration: {type: String},
    }

})


module.exports = mongoose.model('Appointment', appointmentSchema);