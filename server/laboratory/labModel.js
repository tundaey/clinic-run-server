/**
 * Created by Tundaey on 4/6/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var recordSchema = new mongoose.Schema({
    hospital_number: {type: String, required: true},
    patient_category: {
        type: {type: String},
        enrollee_type: {type: String},
        organization: {type: String},
        enroll_number: {type: String},
    },
    registration_date: {type: Date},
    personal_info: {
        first_name: {type: String, required: true},
        middle_name: {type: String, required: true},
        last_name: {type: String, required: true},
        dob: {type: Date},
        sex: {type: String},
        marital_status: {type: String},
        religion: {type: String},
        tribe: {type: String},
        email: {type: String},
        place_of_origin: {type: String},
        pic: {type: String},
    },
    contact_info: {
        residential_address: {
            country: {type: String},
            state: {type: String},
            town: {type: String},
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
})


module.exports = mongoose.model('Record', recordSchema);