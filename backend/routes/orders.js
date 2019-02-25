const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const checkAuth = require('../middleware/check-auth');
let type = 'test';

router.get('', async(req,res,next)=>{

    let orders = await Order.find();
    res.status(200).json({
        orders
    });
});

router.post('', checkAuth, async(req,res,next)=>{
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

module.exports = router;
