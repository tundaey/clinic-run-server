/**
 * Created by Tundaey on 4/27/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var consultSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Record'},
    date: {type: Date, default: Date.now()},
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    complaints: {type: String},
    examination: {type: String},
    family_hx: {type: String},
    hx_complaints: {type: String},
    immunization_hx: {type: String},
    investigation: {type: String},
    past_hx: {type: String},
    results: {type: String},
    social_hx: {type: String},
    summary: {type: String},
    treatment: {type: String},
    working_diagnosis: {type: String}
})


module.exports = mongoose.model('Consult', consultSchema);