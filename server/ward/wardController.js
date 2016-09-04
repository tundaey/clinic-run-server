/**
 * Created by Tundaey on 4/28/2016.
 */
var Ward = require('./wardModel');
var Bed = require('../beds/bedModel');
module.exports = {
    createWard: function(req, res, next){
        console.log("create ward", req.body);
        var bedNumber = Number(req.body.beds);
        bedNumber++
        console.log("bed number", bedNumber);
        var ward = new Ward();
        ward.name = req.body.name;
        ward.save(function(err, w){
            if(err) return next(err);
            var beds = []

            for(var i=1; i < bedNumber; i++){
                console.log("for loop")
                var bed = {};
                bed.name = "Bed" + i;
                bed.status = false;
                bed.ward = w._id;
                beds.push(bed);
                console.log("bed", bed)
            }

            Bed.create(beds, function(err){
                if(err) return next(err);
                Bed.find({ward: w._id}, function(err, bs){
                    console.log("bs", bs)
                    var bedIds = bs.map(function(bed){
                        return bed._id;
                    })
                    console.log("bedids", bedIds)
                    w.beds = bedIds;
                    w.save(function(err){
                        res.json({message: 'Ward Created ', success: true})
                    })
                })

            })

        })

    },

    getWards: function(req, res, next){
        Ward.find({}, function(err, wards){
            if(err) return next(err);
            res.json({wards: wards})
        })
    },

    getWardAndBeds: function(req, res, next){
        Ward.find({})
            .populate('beds')
            .exec(function(err, wards){
            if(err) return next(err);
            res.json({wards: wards})
        })
    },

    getWard: function(req, res, next){
        Ward.findOne({_id: req.params.id})
            .populate('bed')
            .populate('nurses')
            .exec(function(err, ward){
                if(err) return next(err);
                if(!ward){
                    res.json({success: false, message: 'No Ward found'})
                }
                res.json({success: true, ward: ward});
            })
    },
    
    getBedInWard: function(req, res, next){
        Bed.find({ward: req.params.id, status: false}, function(err, beds){
            if(err) return next(err);
            res.json(beds);
        })
    },

    createBed: function(req, res, next){
        Bed.find({}, function(err, beds){
            if(err) return next(err);

            if(beds.length <= 0){
                var b = new Bed();
                b.name = "Bed" + 0
                b.ward = req.params.id;
                b.save(function(err, savedBed){
                    res.json({message: "Bed Saved"})
                })
            }

            var lastBed = beds[beds.length - 1]
            var lastBedName = lastBed.name;
            var num = lastBed.replace(/^\D+/g, "")
            num++;
            var newBedName = "Bed"+ num;
            var newBed = new Bed();
            newBed.name = newBedName;
            newBed.ward = req.params.id;
            newBed.save(function(err,s){
                res.json({message: "Bed Saved"})
            })
        })
    }
}