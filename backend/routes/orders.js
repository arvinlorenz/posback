const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const OpenOrder = require('../models/open-orders');
const checkAuth = require('../middleware/check-auth');
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
        token: req.body.token,
        orderNumber: req.body.orderNumber 
    });

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

router.post('/open', async(req,res,next)=>{
    // let credentials = await Token.findOne({type});
    // res.status(200).json({
    //     id: credentials._id,
    //     token: credentials.token,
    //     applicationId: credentials.applicationId,
    //     applicationSecret: credentials.applicationSecret
    // });
    let openOrders = req.body.orders.Data;
    let openOrdersArray = [];


        
    const promisesArray = await openOrders.reduce(async(acc, order) => {
        let promises = await acc;
        let filteredOrder = await OpenOrder.findOne({OrderId: order.OrderId});
        if(filteredOrder == null){
            promises.push(new Promise(async(resolve, reject) => {
                resolve(order)
            }))
        }

        return promises;
    }, Promise.resolve([]));
    
    let promiseResponses = await Promise.all(promisesArray);


    let secondPromises = [];
    for (const res of promiseResponses) {
        let openOrder = new OpenOrder(res);
        secondPromises.push(new Promise(async(resolve, reject) => {
            resolve(openOrder.save())
        }))
       
    }
    let a = await Promise.all(secondPromises);
    res.status(201).json({
        message: "Order added successfully",
        openOrders: a,
        
    });
});

module.exports = router;
