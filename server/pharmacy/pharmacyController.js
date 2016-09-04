/**
 * Created by Tundaey on 4/28/2016.
 */
var Pharmacy = require('./pharmacyModel');
var Record = require('../records/recordModel');
module.exports = {
    pharmacyRequest: function(req, res, next){
        var pharma = new Pharmacy();
        pharma.patient = req.body.patient_id;
        pharma.doctor = req.decoded.id;
        pharma.clinic = req.body.clinic;
        pharma.clinical_diagnosis = req.body.clinical_diagnosis;
        pharma.drugs = req.body.drug;
        pharma.special_instruction = req.body.special_instruction;
        //lab.emergency = req.body.emergency;
        pharma.save(function(err, l){
            if(err) return next(err);
            Record.findOne({_id: l.patient}, function(error, r){
                r.medications.push(l._id);
                r.save(function(err, saved){
                    if(err) return next(err);
                    res.json({message: 'Drugs prescribed ', success: true})
                })
            })

        })

    },

    getPrescriptions: function(req, res, next){
        Pharmacy.find({})
            .populate('doctor')
            .exec(function(err, pharma){
                if(err) return next(err);
                res.json(pharma)
            })
    },

    getPendingPrescriptionRequests: function(req, res, next){
        Pharmacy.find({status: false})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, pharma){
                if(err) return next(err);
                res.json(pharma)
            })
    },

    getCompletePrescriptions: function(req, res, next){
        Pharmacy.find({status: true})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, pharma){
                if(err) return next(err);
                res.json(pharma)
            })
    },

    getPatientPrescriptions: function(req, res, next){
        Pharmacy.find({patient: req.params.id})
            .populate('doctor')
            .exec(function(err, pharma){
                if(err) return next(err);
                res.json(pharma)
            })
    },

    getPrescription: function(req, res, next){
        Pharmacy.findOne({_id: req.params.id})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, pharma){
                if(err) return next(err);
                if(!pharma){
                    res.json({success: false, message: 'No lab found'})
                }
                res.json({success: true, pharma: pharma});
            })
    },

    updatePrescription: function(req, res, next){
        Pharmacy.findOne({_id: req.params.id}, function(err, pharma){
            if(err) return next(err);
            if(!pharma){
                res.status(403).json({success: false, message: 'No consult found'})
            }
            if(pharma){
                pharma.drugs = req.body.drugs;
                pharma.status = true;
                pharma.date_processed = Date.now();
                pharma.save(function(err, l){
                    res.json({success: true});
                })
            }
        })
    }
}