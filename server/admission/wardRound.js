var mongoose = require('mongoose');
var config = require('../../config');
var wardRoundSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Record'},
    date: {type: Date, default: Date.now()},
    nurse: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    admission: {type: mongoose.Schema.Types.ObjectId, ref: 'Admission'},
    report: {type: String}
})


module.exports = mongoose.model('WardRound', wardRoundSchema);