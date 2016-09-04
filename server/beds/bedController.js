/**
 * Created by Tundaey on 4/28/2016.
 */
var Admission = require('./admissionModel');
var Record = require('../records/recordModel');
module.exports = {
    admissionRequest: function(req, res, next){
        var admission = new Admission();
        admission.patient = req.body.patient_id;
        admission.doctor = req.decoded.id;
        admission.clinic = req.body.clinic;
        admission.clinical_diagnosis = req.body.diagnosis;
        admission.ward = req.body.ward.name;
        admission.admission_type = req.body.type;
        admission.remarks = req.body.remarks;
        admission.save(function(err, l){
            if(err) return next(err);
            Record.findOne({_id: l.patient}, function(error, r){
                r.admissions.push(l._id);
                r.save(function(err, saved){
                    if(err) return next(err);
                    res.json({message: 'Patient Admitted ', success: true})
                })
            })

        })

    },

    getAdmissions: function(req, res, next){
        Admission.find({})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, admissions){
                if(err) return next(err);
                res.json(admissions)
            })
    },

    getPendingAdmissionRequests: function(req, res, next){
        Admission.find({status: false})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, admissions){
                if(err) return next(err);
                res.json(admissions)
            })
    },

    getAdmittedPatients: function(req, res, next){
        Admission.find({status: true})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, admissions){
                if(err) return next(err);
                res.json(admissions)
            })
    },

    getPatientAdmissions: function(req, res, next){
        Admission.find({patient: req.params.id})
            .populate('doctor')
            .exec(function(err, admissions){
                if(err) return next(err);
                res.json(admissions)
            })
    },

    getAdmission: function(req, res, next){
        Admission.findOne({_id: req.params.id})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, a){
                if(err) return next(err);
                if(!a){
                    res.json({success: false, message: 'No Admission found'})
                }
                res.json({success: true, admission: a});
            })
    },

    /*updatePrescription: function(req, res, next){
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
    }*/
}