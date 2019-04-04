const axios = require('axios');
const OpenOrders = require('../models/open-orders');

let deleteProcessed = async(payload)=>{
    let openOrders = payload.orders;
    let allOrders = await OpenOrders.find();
    let openOrderIdsArray = openOrders.map(openOrders=>{
        return openOrders.OrderId
    })

   allOrders.forEach(order=>{
        if(!openOrderIdsArray.includes(order.OrderId)){
            OpenOrders.deleteOne({OrderId:order.OrderId}).then((a)=>{
                console.log(order.OrderId +" "+ order.NumOrderId + " deleted")
                console.log(a)
            })
            
        }
   })
}
    
module.exports = {
    deleteProcessed
}