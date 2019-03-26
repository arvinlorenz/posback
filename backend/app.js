const path = require('path'); //construct paths in a way htats safe to run on any operation system
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const tokenRoutes = require('./routes/token');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const app = express();

const {checkAndSaveOrders} = require('./functions/orders');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Pos")
    .then(()=>{
        console.log('Connected to Database!');
    })
    .catch(()=>{
        console.log('Connection failed!');
    });
app.use(bodyParser.json());
app.use((req,res,next)=>{
    
    res.setHeader('X-Auth-Token', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin,X-Requested-With, Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});


    // try {
    //     checkAndSaveOrders();
        
    // } catch (error) {
    //     console.log('repeating process')
    //     checkAndSaveOrders();
    // }




app.use('/api/token',tokenRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/user',userRoutes);
app.use('/', express.static(path.join(__dirname,'..','dist/pos')));
app.use((request, response) => {
	response.sendFile(path.join(__dirname,'..', 'dist/pos', 'index.html'));
});
// app.get('*', (request, response) => {
// 	response.sendFile(path.join(__dirname,'..', 'dist/pos', 'index.html'));
// });

module.exports = app;