const express = require('express');
const router = express.Router();
const User = require('../models/users');

const bcrypt = require('bcrypt'); //encryption funcitonalities
const jwt = require('jsonwebtoken');


router.post('', async(req,res,next)=>{
    try {
        // let user = await User.findOne({email: req.body.email});
        let user = {
          email: 'admin@damienwhite.com',
          password: await bcrypt.hash('DamienWhite2020', 10)
          //DamienWhite20202
        }

        console.log(user.password);
        if(!user){
            res.status(200).json({
                message: 'Auth failed'
            });
        }
        let result = await bcrypt.compare(req.body.password, user.password);
        console.log(result);
        if(!result){
            res.status(200).json({
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
