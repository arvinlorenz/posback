const mongoose = require('mongoose');

//BLUEPRINT
const processedOrdersSchema = mongoose.Schema({
    
    pkOrderID: {
        type: String
    },

    dReceivedDate: {
        type: String
    },

    dProcessedOn: {
        type: String
    },

    timeDiff: {
        type: String
    },
    
    OrderId: {
        type: String
    },

    fPostageCost: {
        type: String
    },

    fTotalCharge: {
        type: String
    },

    PostageCostExTax: {
        type: String
    },
    
    OrderId: {
        type: String
    },

    Subtotal: {
        type: String
    },

    fTax: {
        type: String
    },

    TotalDiscount: {
        type: String
    },
    
    OrderId: {
        type: String
    },

    ProfitMargin: {
        type: String
    },

    CountryTaxRate: {
        type: String
    },

    nOrderId: {
        type: String
    },
    
    OrderId: {
        type: String
    },

    nStatus: {
        type: String
    },

    cCurrency: {
        type: String
    },

    PostalTrackingNumber: {
        type: String
    },
    
    cCountry: {
        type: String
    },

    Source: {
        type: String
    },

    PostalServiceName: {
        type: String
    },

    PostalServiceCode: {
        type: String
    },

    ReferenceNum: {
        type: String
    },

    SecondaryReference: {
        type: String
    },

    ExternalReference: {
        type: String
    },

    Address1: {
        type: String
    },

    Address2: {
        type: String
    },

    Address3: {
        type: String
    },

    Town: {
        type: String
    },

    Region: {
        type: String
    },

    BuyerPhoneNumber: {
        type: String
    },

    Company: {
        type: String
    },

    SubSource: {
        type: String
    },

    ChannelBuyerName: {
        type: String
    },

    AccountName: {
        type: String
    },

    cFullName: {
        type: String
    },

    cEmailAddress: {
        type: String
    },

    cPostCode: {
        type: String
    },
    dPaidOn: {
        type: String
    },
    dCancelledOn: {
        type: String
    },
    ItemWeight: {
        type: String
    },
    TotalWeight: {
        type: String
    },
    HoldOrCancel: {
        type: String
    },
    IsResend: {
        type: String
    },
    IsExchange: {
        type: String
    },
    FulfilmentLocationName: {
        type: String
    },
    linnToken: {
        type: String
    },
    type: {
        type: String
    },
    Items:{
        type: Array
    }
},{ collection: 'savedOrders' });

//MODEL
module.exports = mongoose.model('ProcessedOrders', processedOrdersSchema);

