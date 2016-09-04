/**
 * Created by Tundaey on 4/6/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var recordSchema = new mongoose.Schema({
    hospital_number: {type: String},
    receipt_number: {type: String},
    patient_category: {
        type: {type: String},
        enrollee_type: {type: String},
        organization: {type: String},
        enroll_number: {type: String},
    },
    registration_date: {type: Date, default: Date.now()},
    personal_info: {
        title: {type: String},
        surname: {type: String},
        othernames: {type: String},
        dob: {type: Date},
        sex: {type: String},
        age: {type: Number},
        marital_status: {type: String},
        religion: {type: String},
        tribe: {type: String},
        email: {type: String},
        place_of_origin: {type: String},
        pic: {type: String},
    },
    contact_info: {
        residential_address: {
            state: {type: String},
            address: {type: String}
        },
        phone: {type: String},
        occupation: {type: String},
        next_of_kin: {
            name: {type: String},
            address: {type: String},
            phone: {type: String},
            relationship: {type: String},
        }
    },
    appointments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'}],
    medications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy'}],
    lab: [{type: mongoose.Schema.Types.ObjectId, ref: 'Lab'}],
    consults: [{type: mongoose.Schema.Types.ObjectId, ref: 'Consult'}],
    admissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Admission'}],
    imaging: [{type: mongoose.Schema.Types.ObjectId, ref: 'Imaging'}],
})


module.exports = mongoose.model('Record', recordSchema);