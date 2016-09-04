var mongoose = require('mongoose');
var config = require('../../config');
var observationChartSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Record'},
    date: {type: Date, default: Date.now()},
    nurse: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    admission: {type: mongoose.Schema.Types.ObjectId, ref: 'Admission'},
    temperature: {type: String},
    pulse: {type: String},
    respiration: {type: String},
    bowel: {type: String},
    bladder: {type: String},
    bp: {type: String},
    remarks: {type: String}
})


module.exports = mongoose.model('ObservationChart', observationChartSchema);