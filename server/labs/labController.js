/**
 * Created by Tundaey on 4/28/2016.
 */
var Lab = require('./labModel');
var Record = require('../records/recordModel');
module.exports = {
    labRequest: function(req, res, next){
        var lab = new Lab();
        lab.patient = req.body.patient_id;
        lab.doctor = req.decoded.id;
        lab.clinic = req.body.clinic;
        lab.clinical_diagnosis = req.body.clinical_diagnosis;
        lab.investigation = req.body.investigation;
        lab.special_instruction = req.body.special_instruction;
        lab.emergency = req.body.emergency;
        lab.save(function(err, l){
            if(err) return next(err);
            Record.findOne({_id: l.patient}, function(error, r){
                r.lab.push(l._id);
                r.save(function(err, saved){
                    if(err) return next(err);
                    res.json({message: 'Lab requested ', success: true})
                })
            })

        })

    },

    getLabs: function(req, res, next){
        Lab.find({})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, labs){
                if(err) return next(err);
                res.json(labs)
            })
    },

    getLabRequests: function(req, res, next){
        Lab.find({status: false})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, labs){
                if(err) return next(err);
                res.json(labs)
            })
    },

    getLabComplete: function(req, res, next){
        Lab.find({status: true})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, labs){
                if(err) return next(err);
                res.json(labs)
            })
    },

    getPatientLabs: function(req, res, next){
        Lab.find({patient: req.params.id})
            .populate('doctor')
            .exec(function(err, labs){
                if(err) return next(err);
                res.json(labs)
            })
    },

    getLab: function(req, res, next){
        Lab.findOne({_id: req.params.id})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, lab){
                if(err) return next(err);
                if(!lab){
                    res.json({success: false, message: 'No lab found'})
                }
                res.json({success: true, lab: lab});
            })
    },

    updateLab: function(req, res, next){
        Lab.findOne({_id: req.params.id}, function(err, lab){
            if(err) return next(err);
            if(!lab){
                res.status(403).json({success: false, message: 'No consult found'})
            }
            if(lab){
                lab.result = req.body.result;
                lab.status = true;
                lab.date_processed = Date.now();
                lab.save(function(err, l){
                    res.json({success: true});
                })
            }
        })
    }
}