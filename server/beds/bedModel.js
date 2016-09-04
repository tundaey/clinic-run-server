/**
 * Created by Tundaey on 4/27/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var bedSchema = new mongoose.Schema({
    ward: {type: mongoose.Schema.Types.ObjectId, ref: 'Ward'},
    name: {type: String},
    status: {type: Boolean, default: false},
})


module.exports = mongoose.model('Bed', bedSchema);