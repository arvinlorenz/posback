const axios = require('axios');


let openOrdersCall = async(orders)=>{
    let url = `http://frozen-savannah-76475.herokuapp.com/api/orders/open`
    let params = {
       orders
    }
    try {
        let orders =  await axios.post(url,params);
        return orders.data
  
    } catch (error) {
        console.log(error)
    }
     
}
    
module.exports = {
    openOrdersCall
}