const express = require('express');
const router = express.Router();
const User = require('../models/users');

const bcrypt = require('bcrypt'); //encryption funcitonalities
const jwt = require('jsonwebtoken');


router.post('', async(req,res,next)=>{
    try {
        let user = await User.findOne({email: req.body.email});
        if(!user){
            res.status(401).json({
                message: 'Auth failed'
            });  
        }
        let result = await bcrypt.compare(req.body.password, user.password);
        if(!result){
            res.status(401).json({
                message: 'Auth failed'
            });  
        }
        
        const token = jwt.sign(
            { email: user.email, userId: user._id}, 
                'JWSECRET',
                {expiresIn:'1h'}
            );
            
        res.status(200).json({
            token
        })

    } catch (error) {
        res.status(401).json({
            message: 'Auth failed'
        });  
    }
    
});

module.exports = router;
