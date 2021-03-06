/**
 * Created by Tundaey on 4/27/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var imagingSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Record'},
    date: {type: Date, default: Date.now()},
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    clinic: {type: String},
    clinical_diagnosis: {type: String},
    result: {type: String},
    investigation: [],
    comments: {type: String},
    status: {type: String},
    date_processed: {type: Date},
    status: {type: Boolean, default: false}
})


module.exports = mongoose.model('Imaging', imagingSchema);