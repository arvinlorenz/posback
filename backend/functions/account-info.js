const axios = require('axios');


let accountInfo = async(credentials)=>{
    
    let url = 'https://api.linnworks.net/api/Auth/AuthorizeByApplication'
    
    try {
        let credentialsD = await axios.post(url,credentials);
        return credentialsD.data;
    } catch (error) {
       console.log(error) 
    }
    
}
    
module.exports = {
    accountInfo
}