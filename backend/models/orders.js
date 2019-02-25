const mongoose = require('mongoose');

//BLUEPRINT
const ordersSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    orderNumber: {
        type: String,
        required: true
    },
    token:{
        type: String,
        required: true
    }
});

//MODEL
module.exports = mongoose.model('Order', ordersSchema);
