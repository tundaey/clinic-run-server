/**
 * Created by Tundaey on 4/6/2016.
 */
var Record = require('./recordModel');
var config = require('../../config');

module.exports = {
    createRecord: function(req, res, next){
        console.log(req.body);
        var hospital_no = require('../utils/generator')()
        Record.findOne({"hospital_number": hospital_no}, function(err, record){
            if(err) return next(err);
            if(record) return res.status(400).json({success: false, message: "Patient already exists"});
            if(!record){
                var newRecord = new Record();
                newRecord.hospital_number = hospital_no;
                newRecord.patient_category = req.body.patient_category;
                newRecord.personal_info = req.body.personal_info;
                newRecord.contact_info = req.body.contact_info;
                newRecord.save(function(err, savedRecord){
                    if(err) return next(err);
                    savedRecord.save(function(error, s){
                        if(error) return next(err);
                        res.json({
                            message: 'New Patient Record Created!',
                            success: true
                        })
                    });
                })

            }
        })
    },

    getRecords: function(req, res, next){
        Record.find({}, function(err, records){
            if(err) return next(err);
            res.json({records: records, success: true});
        })

    },

    getRecord: function(req, res, next){
        if(req.params.id){
            console.log(req.body);
            console.log(req.params.id);
            Record.findById(req.params.id)
                .populate('appointments consults consults.doctor labs')
                .exec(function (err, record) {
                    if (err) return next(err);
                    console.log("appoint", record)
                    res.json({record: record, success: true})
                })
        }else{
            res.json({message: "Please provide a patient id", success: false})
        }
    },

    updateUser: function(req, res, next){
        User.findById(req.params.id, function(err, user){
            if(err) return next(err);
            if(req.body.fullname) user.fullname = req.body.fullname;
            if(req.body.role) user.role = req.body.role;
            if(req.body.username) user.username = req.body.username;
            if(req.body.password) user.username = req.body.password;
            user.save(function(err, t){
                if(err) next(err);
                res.json({message: 'User details have been updated', success: true});
            })
        })
    },

    deleteUser: function(req, res, next){
        if(req.decoded.role == 1){
            User.remove({_id: req.params.id}, function (err, user) {
                if (err) return next(err);
                res.send({message: 'Successfully deleted user', success: true})
            });
        }else{
            res.status(401).json({message: "Not Authorized to perform this action", success: false})
        }

    }

}

