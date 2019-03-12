const axios = require('axios');
const OpenOrders = require('../models/open-orders');


let openOrdersCall = async(orders)=>{
    let openOrders = orders;
    const promisesArray = await openOrders.reduce(async(acc, order) => {
        let promises = await acc;
        let filteredOrder = await OpenOrders.findOne({OrderId: order.OrderId});
        if(filteredOrder == null){
            promises.push(new Promise(async(resolve, reject) => {
                resolve({...order, type: 'open'})
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