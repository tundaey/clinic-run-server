/**
 * Created by Tundaey on 4/23/2016.
 */
var Clinic = require('./clinicModel');

module.exports = {
    createClinic: function(req, res, next){
        Clinic.findOne({name: req.body.name}, function(err, clinic){
            if(err) return next(err);
            if(!clinic){
                var new_clinic = new Clinic();
                new_clinic.name = req.body.name;
                new_clinic.save(function(err, c){
                    if(err) return next(err);
                    res.json({
                        message: 'Clinic created',
                        success: true
                    })
                })
            }else{
                res.status(401).json({
                    message: 'Clinic already exists',
                    success: false
                })
            }
        })
    }
}