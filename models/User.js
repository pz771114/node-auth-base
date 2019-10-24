const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    Date:{
        type: Date,
        default: Date.now
    },

});

//create a User model from Schema

const User = mongoose.model('User', UserSchema);

module.exports = User;