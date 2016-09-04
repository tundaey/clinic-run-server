var mongoose = require('mongoose');
var config = require('../../config');
var carePlanSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Record'},
    date: {type: Date, default: Date.now()},
    nurse: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    admission: {type: mongoose.Schema.Types.ObjectId, ref: 'Admission'},
    diagnosis: {type: String},
    objectives: {type: String},
    evaluation: {type: String},
    nursing_orders: {type: String}
})


module.exports = mongoose.model('CarePlan', carePlanSchema);