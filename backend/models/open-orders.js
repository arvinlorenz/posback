const mongoose = require('mongoose');

//BLUEPRINT
const openOrdersSchema = mongoose.Schema({
    NumOrderId: {
        type: String,
        required: true
    },
    GeneralInfo: {
        type: Object,
        required: true
    },
    ShippingInfo: {
        type: Object,
        required: true
    },
    CustomerInfo: {
        type: Object,
        required: true
    },
    TotalsInfo: {
        type: Object,
        required: true
    },
    FolderName: {
        type: Array,
        required: true
    },
    CanFulfil: {
        type: Boolean,
        required: true
    },
    Items:{
        type: Object,
        required: true
    },
    HasItems: {
        type: Boolean,
        required: true
    },
    OrderId: {
        type: String,
        required: true
    },
},{ collection: 'openOrders' });

//MODEL
module.exports = mongoose.model('OpenOrder', openOrdersSchema);

