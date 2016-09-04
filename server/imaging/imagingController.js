/**
 * Created by Tundaey on 4/28/2016.
 */
var Imaging = require('./imagingModel');
var Record = require('../records/recordModel');
module.exports = {
    imagingRequest: function(req, res, next){
        var imaging = new Imaging();
        imaging.patient = req.body.patient_id;
        imaging.doctor = req.decoded.id;
        imaging.clinic = req.body.clinic;
        imaging.clinical_diagnosis = req.body.diagnosis;
        imaging.investigation = req.body.investigation;
        imaging.comments = req.body.comments;
        imaging.save(function(err, l){
            if(err) return next(err);
            Record.findOne({_id: l.patient}, function(error, r){
                r.imaging.push(l._id);
                r.save(function(err, saved){
                    if(err) return next(err);
                    res.json({message: 'Lab requested ', success: true})
                })
            })

        })

    },

    getImagingRequests: function(req, res, next){
        Imaging.find({})
            .populate('doctor')
            .exec(function(err, img){
                if(err) return next(err);
                res.json(img)
            })
    },

    getPendingImagingRequests: function(req, res, next){
        Imaging.find({status: false})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, images){
                if(err) return next(err);
                res.json(images)
            })
    },

    getCompleteImagingRequests: function(req, res, next){
        Imaging.find({status: true})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, images){
                if(err) return next(err);
                res.json(images)
            })
    },

    getPatientImagingRequests: function(req, res, next){
        Imaging.find({patient: req.params.id})
            .populate('doctor')
            .exec(function(err, img){
                if(err) return next(err);
                res.json(img)
            })
    },

    getImaging: function(req, res, next){
        Imaging.findOne({_id: req.params.id})
            .populate('doctor')
            .populate('patient')
            .exec(function(err, img){
                if(err) return next(err);
                if(!img){
                    res.json({success: false, message: 'No lab found'})
                }
                res.json({success: true, img: img});
            })
    },

    updateImaging: function(req, res, next){
        Imaging.findOne({_id: req.params.id}, function(err, img){
            if(err) return next(err);
            if(!img){
                res.status(403).json({success: false, message: 'No consult found'})
            }
            if(img){
                img.result = req.body.result;
                img.status = true;
                img.date_processed = Date.now();
                img.save(function(err, l){
                    if(err) return next(err);
                    res.json({success: true});
                })
            }
        })
    }
}