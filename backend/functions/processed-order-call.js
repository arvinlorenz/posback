const axios = require('axios');


let processedOrderCall = async(infos)=>{
    let url = `https://frozen-savannah-76475.herokuapp.com/api/orders/processed`
    let params = {
        ...infos
    }
    try {
        let orders =  await axios.post(url,params);
        return orders.data
  
    } catch (error) {
        console.log(error)
    }
     
}
    
module.exports = {
    processedOrderCall
}