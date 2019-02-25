const mongoose = require('mongoose');

//BLUEPRINT
const tokenSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    applicationId:{
        type: String,
        required: true
    },
    applicationSecret: {
        type: String,
        required: true
    }
});

//MODEL
module.exports = mongoose.model('Token', tokenSchema);
