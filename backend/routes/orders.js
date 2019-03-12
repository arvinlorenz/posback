const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const OpenOrders = require('../models/open-orders');
const ProcessedOrders = require('../models/processed-orders');
const checkAuth = require('../middleware/check-auth');
const axios = require('axios');
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
