const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.x-auth-token.split(" ")[1];
        const decodedToken = jwt.verify(token, JWSECRET);
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}; // this data will be available in every middleware running after this
        next();
    }
    catch(e){
        res.status(401).json({message: 'You are not authenticated'});
    }
    


}