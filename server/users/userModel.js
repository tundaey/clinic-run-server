/**
 * Created by Tundaey on 4/6/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var userSchema = new mongoose.Schema({
    fullname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    role: {id: {type: Number}, name: {type: String}},
    password_changed: {type: Boolean, default: false},
    loggedIn: {type: Boolean, default: false}
})

userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    })
});

userSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password)
};

userSchema.methods.generateJWT = function(){
    return jwt.sign({
        id: this._id,
        role: this.role.id,
    }, config.jwtsecret)
};

module.exports = mongoose.model('User', userSchema);