const express = require('express');
const router = express.Router();
// const Token = require('../models/token');
let type = 'test'

router.get('', async(req,res,next)=>{
    // let credentials = await Token.findOne({type});
    res.status(200).json({
        //  id: credentials._id,
        token: process.env.TOKEN,
        applicationId: process.env.APPLICATION_ID,
        applicationSecret: process.env.APPLICATION_SECRET
    });
    console.log(process.env.TOKEN);
});

// router.put('/:id', async(req,res,next)=>{
//     console.log(req.params.id)
//     const newToken = new Token({
//         _id: req.params.id,
//         token: req.body.token,
//         applicationId: req.body.applicationId,
//         applicationSecret: req.body.applicationSecret
//     });
//     result = await Token.updateOne({_id: req.params.id}, newToken);
//     if(result.n > 0){
//         res.status(200).json({message: 'Update successful'});
//     }
//     else{
//         res.status(401).json({message: 'Not authorized'});
//     }

// });



module.exports = router;
