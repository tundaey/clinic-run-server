
var Consult = require('../consults/consultModel');
var Record = require('../records/recordModel');
var Lab = require('../labs/labModel');
var Pharmacy = require('../pharmacy/pharmacyModel');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports = {
    doctorDashboard: function(req, res, next){
        Consult.find({doctor: req.decoded.id})
            .populate('patient')
            .sort('-date')
            .exec(function(err, consults){
                if(err) return next(err);
                var totalConsults = consults.length;
                var lastPatient = consults[0].patient;
                var lastDiagnosis = consults[0].working_diagnosis;
                Pharmacy.find({doctor: req.decoded.id}, function(err, p){
                    if(err) return next(err);
                    var prescriptions = p.length;
                    console.log("object id", new ObjectId(req.decoded.id))
                    Consult.aggregate([
                        { $match: {"doctor": new ObjectId(req.decoded.id) } },
                        {
                             $group: {
                                 _id: {patient: "$patient"},
                                 total: {$sum: 1}
                             }
                         },
                        {
                            $sort: {"total": -1}
                        }
                    ], function(err, result){
                        console.log("err", err);
                        if(err) return next(err);
                        console.log("result", result);
                        Record.findOne({_id: result[0]._id.patient}, function(err, r){
                            Lab.aggregate([
                                { $match: {"doctor": new ObjectId(req.decoded.id) } },
                                /*{ $project : { _id: 1, patient : 1 , author : 1 } },*/
                                {$unwind: "$investigation"},
                                {
                                    $group: {
                                        _id: {lab: "$investigation"},
                                        total: {$sum: 1}
                                    }
                                },
                                {
                                    $sort: {"total": -1}
                                }
                            ], function(err, labResult){
                                if(err) return next(err);
                                Pharmacy.aggregate([
                                    { $match: {"doctor": new ObjectId(req.decoded.id) } },
                                    /*{ $project : { _id: 1, patient : 1 , author : 1 } },*/
                                    {$unwind: "$drugs"},
                                    {
                                        $group: {
                                            _id: {drugs: "$drugs"},
                                            total: {$sum: 1}
                                        }
                                    },
                                    {
                                        $sort: {"total": -1}
                                    }
                                ], function(err, pharmaResult){
                                    if(err) return next(err);
                                    res.json({
                                        consults: totalConsults,
                                        lastPatient: lastPatient,
                                        lastConsultDate: consults[0].date,
                                        lastDiagnosis: lastDiagnosis,
                                        prescriptions: p.length,
                                        mostPatient: r.personal_info,
                                        labResult: labResult,
                                        pharmaResult: pharmaResult,
                                        result: result
                                    })
                                })
                            })

                        })
                    })
                    
                })
            })
        }
    }