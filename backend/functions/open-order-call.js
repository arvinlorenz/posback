const axios = require('axios');
const OpenOrders = require('../models/open-orders');


let openOrdersCall = async(payload)=>{
    let openOrders = payload.orders;
    const promisesArray = await openOrders.reduce(async(acc, order) => {
        let promises = await acc;
        let filteredOrder = await OpenOrders.findOne({OrderId: order.OrderId});
        if(filteredOrder == null){
            promises.push(new Promise(async(resolve, reject) => {
                // resolve({...order, type: 'open', linnToken: payload.linnworksToken})
                resolve({
                        CustomerInfo: order.CustomerInfo, 
                        NumOrderId: order.NumOrderId, 
                        OrderId: order.OrderId, 
                        Items: order.Items,
                        ShippingInfo: order.ShippingInfo, 
                        TotalsInfo: order.TotalsInfo,
                        type: 'open', 
                        linnToken: payload.linnworksToken})
            }))
        }

        return promises;
    }, Promise.resolve([]));
    
    let promiseResponses = await Promise.all(promisesArray);


    let secondPromises = [];
    for (const res of promiseResponses) {
        let openOrder = new OpenOrders(res);
        secondPromises.push(new Promise(async(resolve, reject) => {
            resolve(openOrder.save())
        }))
       
    }
    let a = await Promise.all(secondPromises);
     return a;
}
    
module.exports = {
    openOrdersCall
}