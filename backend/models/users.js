const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //because unique true does not act as a validator. It checks the data before saving in the database

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true //not as validator
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
});

userSchema.plugin(uniqueValidator);
//MODEL
module.exports = mongoose.model('User', userSchema);