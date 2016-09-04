/**
 * Created by Tundaey on 4/28/2016.
 */
var Admission = require('./admissionModel');
var CarePlan = require('./carePlan');
var DailyReport = require('./dailyReport');
var ObservationChart = require('./observationChart');
var DailyReport = require('./dailyReport');
var TreatmentChart = require('./treatmentChart');
var WardRound = require('./wardRound');
var Record = require('../records/recordModel');
var Bed = require('../beds/bedModel');
module.exports = {
    admissionRequest: function(req, res, next){
        var admission = new Admission();
        admission.patient = req.body.patient_id;
        admission.doctor = req.decoded.id;
        admission.clinic = req.body.clinic;
        admission.clinical_diagnosis = req.body.diagnosis;
        admission.ward = req.body.ward._id;
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
        Admission.find({status: false, ward: req.params.id})
            .populate('doctor')
            .populate('patient')
            .populate('ward')
            .exec(function(err, admissions){
                if(err) return next(err);
                res.json(admissions)
            })
    },

    getCurrentAdmissionRequests: function(req, res, next){
        Admission.find({status: true, ward: req.params.id})
            .populate('doctor')
            .populate('patient')
            .populate('ward')
            .populate('bed')
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
            .populate('ward')
            .exec(function(err, admissions){
                if(err) return next(err);
                res.json(admissions)
            })
    },

    getAdmission: function(req, res, next){
        Admission.findOne({_id: req.params.id})
            .populate('doctor')
            .populate('patient')
            .populate({path: 'observation_sheet', populate: 'nurse'})
            .populate({path: 'daily_report', populate: 'nurse'})
            .exec(function(err, a){
                if(err) return next(err);
                if(!a){
                    res.json({success: false, message: 'No Admission found'})
                }
                res.json({success: true, admission: a});
            })
    },

    admitPatient: function(req, res, next){
        Admission.findOne({_id: req.body.admission_id}, function(err, a){
            if(err) return next(err);
            a.status = true;
            Bed.findOne({_id: req.body.bed._id}, function(err, b){
                b.status = true;
                b.save(function(err){
                    if(err) return next(err);
                    a.bed = req.body.bed._id;
                    a.save(function(err){
                        if(err) return next(err);
                        res.json({success: true, message: "Patient Admitted"})
                    })
                })
            })
        })
    },

    createObservationChart: function(req, res, next){
        Admission.findOne({_id: req.body.admission_id}, function(err, admission){
            if(err) return next(err);
            var obs = new ObservationChart({
            patient: req.body.patient_id,
            nurse: req.decoded.id,
            admission: req.body.admission_id,
            temperature: req.body.temperature,
            pulse: req.body.pulse,
            respiration: req.body.respiration,
            bowel: req.body.bowel,
            bp: req.body.bp,
            bladder: req.body.bladder,
            remarks: req.body.remarks
        })
        obs.save(function(err, o){
            if(err) return next(err);
            admission.observation_sheet.push(o._id);
            admission.save(function(err, a){
                if(err) return next(err, a);
                res.json({
                    success: true,
                    admission: a,
                    message: 'Observation Sheet Saved'
                })
            })
        })
    })
        
},

getObservationChart: function(req, res, next){
    ObservationChart.find({admission: req.params.admission_id})
        .populate('nurse')
        .exec(function(err, observation_sheet){
            if(err) return next(err);
            res.json({
                    success: true,
                    obs : observation_sheet
            })
        })
},

createDailyReport: function(req, res, next){
    Admission.findOne({_id: req.body.admission_id}, function(err, admission){
        if(err) return next(err);
        var dailyReport = new DailyReport();
        dailyReport.report = req.body.report;
        dailyReport.patient = req.body.patient_id;
        dailyReport.nurse = req.decoded.id,
        dailyReport.admission = req.body.admission_id,
        dailyReport.save(function(err, d){
            if(err) return next(err);
            admission.daily_report.push(d._id);
            admission.save(function(err){
                if(err) return next(err);
                res.json({
                    success: true,
                    message: "Daily Report Saved"
                })
            })
        })
    })
},

getDailyReport: function(req, res, next){
    DailyReport.find({admission: req.params.admission_id})
        .populate('nurse')
        .exec(function(err, daily){
            if(err) return next(err);
            res.json({
                    success: true,
                    daily : daily
            })
        })
},

createTreatmentChart: function(req, res, next){
    Admission.findOne({_id: req.body.admission_id}, function(err, admission){
        if(err) return next(err);
        var treatmentChart = new TreatmentChart();
        treatmentChart.drug = req.body.drug;
        treatmentChart.dosage = req.body.dosage;
        treatmentChart.route = req.body.route;
        treatmentChart.remarks = req.body.remarks;
        treatmentChart.patient = req.body.patient_id;
        treatmentChart.nurse = req.decoded.id,
        treatmentChart.admission = req.body.admission_id,
        treatmentChart.save(function(err, d){
            if(err) return next(err);
            admission.treatment_chart.push(d._id);
            admission.save(function(err){
                if(err) return next(err);
                res.json({
                    success: true,
                    message: "Treatment Chart Saved"
                })
            })
        })
    })
},

getTreatmentChart: function(req, res, next){
    TreatmentChart.find({admission: req.params.admission_id})
        .populate('nurse')
        .exec(function(err, treatment){
            if(err) return next(err);
            res.json({
                    success: true,
                    treatment : treatment
            })
        })
},

createCarePlan: function(req, res, next){
    Admission.findOne({_id: req.body.admission_id}, function(err, admission){
        if(err) return next(err);
        var carePlan = new CarePlan();
        carePlan.diagnosis = req.body.diagnosis;
        carePlan.objectives = req.body.objectives;
        carePlan.evaluation = req.body.evaluation;
        carePlan.nursing_orders = req.body.orders;
        carePlan.remarks = req.body.remarks;
        carePlan.patient = req.body.patient_id;
        carePlan.nurse = req.decoded.id,
        carePlan.admission = req.body.admission_id,
        carePlan.save(function(err, d){
            if(err) return next(err);
            admission.nursing_care.push(d._id);
            admission.save(function(err){
                if(err) return next(err);
                res.json({
                    success: true,
                    message: "Treatment Chart Saved"
                })
            })
        })
    })
},

getCarePlan: function(req, res, next){
    CarePlan.find({admission: req.params.admission_id})
        .populate('nurse')
        .exec(function(err, care){
            if(err) return next(err);
            res.json({
                    success: true,
                    care : care
            })
        })
},

createWardRound: function(req, res, next){
    Admission.findOne({_id: req.body.admission_id}, function(err, admission){
        if(err) return next(err);
        var wardRound = new WardRound();
        wardRound.report = req.body.report;
        wardRound.patient = req.body.patient_id;
        wardRound.nurse = req.decoded.id,
        wardRound.admission = req.body.admission_id,
        wardRound.save(function(err, d){
            if(err) return next(err);
            admission.ward_rounds.push(d._id);
            admission.save(function(err){
                if(err) return next(err);
                res.json({
                    success: true,
                    message: "Ward Round Saved"
                })
            })
        })
    })
},

getWardRound: function(req, res, next){
    WardRound.find({admission: req.params.admission_id})
        .populate('nurse')
        .exec(function(err, ward){
            if(err) return next(err);
            res.json({
                    success: true,
                    ward : ward
            })
        })
},

    
}