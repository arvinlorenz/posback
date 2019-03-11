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



router.post('/open', async(req,res,next)=>{
    // let credentials = await Token.findOne({type});
    // res.status(200).json({
    //     id: credentials._id,
    //     token: credentials.token,
    //     applicationId: credentials.applicationId,
    //     applicationSecret: credentials.applicationSecret
    // });
   
    let openOrders = req.body.orders;
    let openOrdersArray = [];


        
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
    res.status(201).json({
        message: "Order added successfully",
        openOrders: a,
        
    });
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

router.post('/processed', async(req,res,next)=>{
    
  
    
    let processedOrders = req.body.orders;
    let processedOrdersArray = [];

   
        
    const promisesArray = await processedOrders.reduce(async(acc, order) => {
        let promises = await acc;
        let filteredOrder = await ProcessedOrders.findOne({OrderId: order.pkOrderID});
        if(filteredOrder == null){
          
            try {
                let headers = {
        
                    'Authorization': req.body.token 
                }
                let url = 'https://as-ext.linnworks.net/api/ProcessedOrders/GetProcessedItemDetails'
 
                let items = await axios.post(url, 
                                            {   pkOrderId : order.pkOrderID,
                                                includeChildren : true,
                                                includeItemOptions : true 
                                            }, 
                                            {headers});
             
                    
                promises.push(new Promise(async(resolve, reject) => {
                    resolve({...order, OrderId: order.pkOrderID, type: 'processed', Items: items.data})
                }))
            } catch (error) {
                console.log(error)
            }
            
        }

        return promises;
    }, Promise.resolve([]));
    
    let promiseResponses = await Promise.all(promisesArray);


    let secondPromises = [];
    for (const res of promiseResponses) {
        let processedOrder = new ProcessedOrders(res);
        secondPromises.push(new Promise(async(resolve, reject) => {
            resolve(processedOrder.save())
        }))
       
    }
    let a = await Promise.all(secondPromises);
    res.status(201).json({
        message: "Order added successfully",
        processedOrders: a,
        
    });
});


module.exports = router;
