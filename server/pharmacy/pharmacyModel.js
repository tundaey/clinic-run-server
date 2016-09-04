/**
 * Created by Tundaey on 4/27/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var pharmaSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Record'},
    date: {type: Date, default: Date.now()},
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    clinic: {type: String},
    clinical_diagnosis: {type: String},
    comment: {type: String},
    result: {type: String},
    drugs: [
        {
            name: {type: String},
            prescription: {type: String}
        }
    ],
    special_instruction: {type: String},
    date_processed: {type: Date},
    emergency: {type: Boolean},
    status: {type: Boolean, default: false}
})


module.exports = mongoose.model('Pharmacy', pharmaSchema);