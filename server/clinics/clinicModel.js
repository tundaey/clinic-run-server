/**
 * Created by Tundaey on 4/6/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var clinicSchema = new mongoose.Schema({
    name: {type: String},

})


module.exports = mongoose.model('Clinic', clinicSchema);