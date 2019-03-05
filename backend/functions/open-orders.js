const axios = require('axios');


let openOrders = async(info)=>{
    let url = `${info.server}/api/Orders/GetOpenOrders`
    let params = {
        entriesPerPage: 100,
        pageNumber: 1
    }
    let headers = {
        
        'Authorization': info.token 
    }
    try {
        let orders =  await axios.post(url,params,{headers});
        return orders.data.Data
  
    } catch (error) {
        console.log(error)
    }
     
}
    
module.exports = {
    openOrders
}