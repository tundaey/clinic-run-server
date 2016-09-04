/**
 * Created by Tundaey on 4/27/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var admissionSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Record'},
    date: {type: Date, default: Date.now()},
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    clinic: {type: String},
    admission_type: {type: String},
    remarks: {type: String},
    clinical_diagnosis: {type: String},
    ward: {type: mongoose.Schema.Types.ObjectId, ref: 'Ward'},
    bed: {type: mongoose.Schema.Types.ObjectId, ref: 'Bed'},
    status: {type: Boolean, default: false},
    discharged: {type: Boolean, default: false},
    observation_sheet : [{type: mongoose.Schema.Types.ObjectId, ref: 'ObservationChart'}],
    daily_report : [{type: mongoose.Schema.Types.ObjectId, ref: 'DailyReport'}],
    nursing_care : [{type: mongoose.Schema.Types.ObjectId, ref: 'CarePlan'}],
    treatment_chart : [{type: mongoose.Schema.Types.ObjectId, ref: 'TreatmentChart'}],
    fluid_balance_chart : [],
    ward_rounds : [{type: mongoose.Schema.Types.ObjectId, ref: 'WardRound'}],
})


module.exports = mongoose.model('Admission', admissionSchema);