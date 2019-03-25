const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const OpenOrders = require('../models/open-orders');

const {credentials} = require('../functions/token');
const {accountInfo} = require('../functions/account-info');
const {openOrders} = require('../functions/open-orders');
const {openOrdersCall} = require('../functions/open-order-call');
let type = 'test';

router.get('', async(req,res,next)=>{

    let orders = await Order.find();
    res.status(200).json({
        orders
    });
});

router.post('', async(req,res,next)=>{
    const order = new Order({
        date: req.body.date,
        name: req.body.name,
        token: req.body.token,
        orderNumber: req.body.orderNumber 
    });
    console.log(order)
    try {
       let createdOrder = await order.save();
        res.status(201).json({
            message: "Order added successfully",
            order: createdOrder,
            
        });
    } catch (error) {
        res.status(500).json({
            message: 'Creating a order failed'
        })
    }

});



router.post('/checkOrderInDB', async(req,res,next)=>{
    let orders = req.body.orders;
 
    try {
        const promisesArray = await orders.reduce(async(acc, order) => {
            let promises = await acc;
            let filteredOrder = await OpenOrders.findOne({OrderId: order.orderId});
            if(filteredOrder != null){
                promises.push(new Promise(async(resolve, reject) => {
                    resolve({...order})
                }))
            }

            return promises;
        }, Promise.resolve([]));
        
        let promiseResponses = await Promise.all(promisesArray);

        res.status(200).json({
            orders: promiseResponses
        });
    } catch (error) {
        res.status(400).json({
            message: "FAILED",
        });
    }  
});

router.post('/fetchOpenOrders', async(req,res,next)=>{
    let credentialsInfo = await credentials()
    let accountInformation = await accountInfo(credentialsInfo);
    try {
        let ainfo = {
            server: accountInformation.Server,
            token: accountInformation.Token
        }
        let openOrdersInfo = await openOrders(ainfo);
        openOrdersCall(openOrdersInfo).then(ordersRes=>{
            orders = 
            res.status(200).json({
                orders: ordersRes.map(order=>{
                    return {NumOrderId: order.NumOrderId,
                    orderId: order.OrderId,
                    Company: order.CustomerInfo.Address.Company,
                    FullName: order.CustomerInfo.Address.FullName,
                    Address1: order.CustomerInfo.Address.Address1,
                    Address2: order.CustomerInfo.Address.Address2,
                    Address3: order.CustomerInfo.Address.Address3,
                    Region: order.CustomerInfo.Address.Region,
                    Town: order.CustomerInfo.Address.Town,
                    PostCode: order.CustomerInfo.Address.PostCode,
                    Country: order.CustomerInfo.Address.Country,
                    EmailAddress: order.CustomerInfo.Address.EmailAddress,
                    PhoneNumber: order.CustomerInfo.Address.PhoneNumber,
                    CountryId: order.CustomerInfo.Address.CountryId}
                })
               });
            
        })
    
      
    } catch (error) {
         throw new Error('there is an error');
    }
});

router.patch('/open', async(req,res,next)=>{
    try {
        await OpenOrders.updateOne({OrderId: req.body.OrderId}, {CustomerInfo: req.body.info});
        res.status(200).json({
         message: "Order updated successfully"
        });
    } catch (error) {
        res.status(400).json({message: 'Not updated'});
    }
   
   
});



module.exports = router;
