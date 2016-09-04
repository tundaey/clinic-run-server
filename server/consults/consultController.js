/**
 * Created by Tundaey on 4/28/2016.
 */
var Consult = require('./consultModel');
var Record = require('../records/recordModel');
var Pharmacy = require('../pharmacy/pharmacyModel');
var Lab = require('../labs/labModel');
var Imaging = require('../imaging/imagingModel');
module.exports = {
    createConsult: function(req, res, next){
        var consult = new Consult();
        consult.patient = req.body.patient_id;
        consult.doctor = req.decoded.id;
        consult.complaints = req.body.complaints;
        consult.examination = req.body.examination;
        consult.family_hx = req.body.family_hx;
        consult.hx_complaints = req.body.hx_complaints;
        consult.immunization_hx = req.body.immunization_hx;
        consult.past_hx = req.body.past_hx;
        consult.results = req.body.results;
        consult.social_hx = req.body.social_hx;
        consult.summary = req.body.summary;
        console.log(req.body.treatment);
        var pharm = new Pharmacy();
        var lab = new Lab();
        var imaging = new Imaging();

        if(req.body.treatment.prescription && req.body.treatment.prescription.length < 0){
            pharm.drugs = req.body.treatment.prescription
        }

        if(req.body.investigation.lab && req.body.investigation.lab.length < 0){
            lab.investigation = req.body.investigation.lab
        }

        if(req.body.investigation.imaging && req.body.investigation.imaging.length < 0){
            imaging.investigation = req.body.investigation.imaging
        }
        var treatment = JSON.stringify(req.body.treatment);
        var investigation = JSON.stringify(req.body.investigation);
        consult.treatment = treatment;
        consult.investigation = investigation;
        consult.working_diagnosis = req.body.working_diagnosis;
        consult.save(function(err, c){
            if(err) return next(err);
            pharm.save(function(err, p){
                if(err) return next(err);
                lab.save(function(err, l){
                    if(err) return next(err);
                    imaging.save(function(err, i){
                        Record.findOne({_id: c.patient}, function(error, r){
                            r.consults.push(c._id);
                            r.medications.push(p._id);
                            r.lab.push(l._id);
                            r.imaging.push(i._id);
                            r.save(function(err, saved){
                                res.json({message: 'Consult created', success: true})
                            })
                        })
                    })
                })
            })

        })

    },

    getConsults: function(req, res, next){
        Consult.find({})
            .populate('doctor')
            .exec(function(err, consults){
                if(err) return next(err);
                res.json(consults)
            })
    },

    getPatientConsults: function(req, res, next){
        Consult.find({patient: req.params.id})
            .populate('doctor')
            .sort('-date')
            .exec(function(err, consults){
                if(err) return next(err);
                res.json(consults)
            })
    },

    getConsult: function(req, res, next){
        Consult.findOne({_id: req.params.id}, function(err, consult){
            if(err) return next(err);
            if(!consult){
                res.json({success: false, message: 'No consult found'})
            }
            res.json({success: true, consult: consult});
        })
    },

    updateConsult: function(req, res, next){
        Consult.findOne({_id: req.params.id}, function(err, consult){
            if(err) return next(err);
            if(!consult){
                res.status(403).json({success: false, message: 'No consult found'})
            }
            if(consult){
                if(req.body.patient_id)consult.patient = req.body.patient_id;
                if(req.body.complaints)consult.complaints = req.body.complaints;
                if(req.body.examination)consult.examination = req.body.examination;
                if(req.body.family_hx)consult.family_hx = req.body.family_hx;
                if(req.body.hx_complaints)consult.hx_complaints = req.body.hx_complaints;
                if(req.body.immunization_hx)consult.immunization_hx = req.body.immunization_hx;
                if(req.body.investigation)consult.investigation = req.body.investigation;
                if(req.body.past_hx)consult.past_hx = req.body.past_hx;
                if(req.body.results)consult.results = req.body.results;
                if(req.body.social_hx)consult.social_hx = req.body.social_hx;
                if(req.body.summary)consult.summary = req.body.summary;
                if(req.body.treatment)consult.treatment = req.body.treatment;
                if(req.body.working_diagnosis)consult.working_diagnosis = req.body.working_diagnosis;
                consult.save(function(err, c){
                    if(err) return next(err);
                    res.json({success: true, message: 'Consult updated'});
                })
            }
        })
    }
}