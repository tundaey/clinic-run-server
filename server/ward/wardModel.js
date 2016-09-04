/**
 * Created by Tundaey on 4/27/2016.
 */
var mongoose = require('mongoose');
var config = require('../../config');
var wardSchema = new mongoose.Schema({
    beds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Bed'}],
    nurses: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    name: {type: String},
})


module.exports = mongoose.model('Ward', wardSchema);