const Token = require('../models/token');
let type = 'test'


let credentials = ()=>{
   return Token.findOne({type})
   .then(cred =>{
       delete cred._id
       return cred
   })
   .catch(e=>{
       return Promise.reject();
   })
  
}
    
module.exports = {
    credentials
}