/**
 * Created by Tundaey on 4/6/2016.
 */
var User = require('./userModel');
var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = {
    register: function(req, res, next){
        console.log(req.body);
        User.findOne({username: req.body.username}, function(err, user){
            if(err) return next(err);
            console.log(err);
            console.log(user);
            if(user) return res.status(400).json({success: false, message: "User already exists"});
            if(!user){
                var newUser = new User();
                newUser.fullname = req.body.fullname;
                newUser.username = req.body.username;
                newUser.password = req.body.password;
                newUser.role.id = req.body.role.id;
                newUser.role.name = req.body.role.name;
                newUser.save(function(err, saved){
                    console.log("reached")
                    console.log(err)
                    if(err) return next(err);
                    var token = saved.generateJWT();
                    res.json({success: true, token: token, message: "User successfully registered"})
                })
            }
        })
    },

    login: function(req, res, next){
        User.findOne({username: req.body.username}).select('_id username fullname password role password_changed')
            .exec(function(err, user){
                if(err) return next(err);
                if(!user) return res.status(400).json({success: false, message: "Wrong username or password"});
                if(user){
                    user.loggedIn = true;
                    var validPassword = user.comparePassword(req.body.password);
                    console.log(validPassword);
                    if(!validPassword){
                        return res.status(400).json({success: false, message: "Wrong username or password"});
                    }
                    user.save(function(err, u){
                        if(err) return next(err);
                        var token = u.generateJWT();
                        var profile = {fullname: u.fullname, role: u.role}
                        res.json({success: true, token: token, message: "Welcome back " + u.fullname, profile: profile})
                    })

                }

            })
    },


    auth: function(req, res, next){
        var token = req.body.token || req.param.token || req.headers['x-access-token'];
        console.log(token);
        if(token){
            jwt.verify(token, config.jwtsecret,  function(err, decoded){
                if(err) return res.status(403).json({success: false, message: "Authentication failure"})
                req.decoded = decoded;
                next();
            })
        }else{
            res.status(403).json({success: false, message: "No token was provided"});
        }
    },

    getProfile: function(req,res, next){
        User.findById(req.decoded.id, function(err, user){
            if(err) return next(err);
            res.json(user);
        })
    },

    logOut: function(req, res, next){
        User.findById(req.decoded.id, function(err, u){
            if(err) return next(err);
            u.loggedIn = false;
            u.save(function(err, saved){
                if(err) return next(err);
                res.json({success: true, message: 'User has been logged out'})
            })
        })
    },

    getUsers: function(req, res, next){
        console.log(req.headers['x-access-token'])
        console.log(req.decoded.id)
        User.findById(req.decoded.id,function(err, user){
            console.log("user",user);
            if(user.role.id == 1){
                User.find({}, function(err, users){
                    if(err) return next(err);
                    res.json({users: users, success: true});
                })
            }else{
                res.status(401).json({success: false, message: "You are not authorized"})
            }
        })

    },

    getOnlineDoctors: function(req, res, next){
        User.find({"loggedIn": true, "role.id": 3}, function(err, doctors){
            if(err) return next(err);
            res.json(doctors);
        })
    },

    getUser: function(req, res, next){
        if(req.params.id){
            User.findById(req.params.id, function (err, user) {
                if (err) return next(err);
                res.json({user: user, success: true})
            })
        }else{
            res.json({message: "Please provide a user id", success: false})
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

