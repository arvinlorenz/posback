const axios = require('axios');
const ProcessedOrders = require('../models/processed-orders');

let processedOrderCall = async(infos)=>{
    
    let processedOrders = infos.orders;
        
    const promisesArray = await processedOrders.reduce(async(acc, order) => {
        let promises = await acc;
        let filteredOrder = await ProcessedOrders.findOne({OrderId: order.pkOrderID});
        if(filteredOrder == null){
          
            try {
                let headers = {
        
                    'Authorization': infos.token 
                }
                let url = `${infos.server}/api/ProcessedOrders/GetProcessedItemDetails`
 
                let items = await axios.post(url, 
                                            {   pkOrderId : order.pkOrderID,
                                                includeChildren : true,
                                                includeItemOptions : true 
                                            }, 
                                            {headers});
             
                    
                promises.push(new Promise(async(resolve, reject) => {
                    resolve({...order, OrderId: order.pkOrderID, type: 'processed', Items: items.data, linnToken: infos.linnworksToken})
                }))
            } catch (error) {
                console.log(error)
            }
            
        }

        return promises;
    }, Promise.resolve([]));
    
    let promiseResponses = await Promise.all(promisesArray);


    let secondPromises = [];
    for (const res of promiseResponses) {
        let processedOrder = new ProcessedOrders(res);
        secondPromises.push(new Promise(async(resolve, reject) => {
            resolve(processedOrder.save())
        }))
       
    }
    let a = await Promise.all(secondPromises);
    return a;
     
}
    
module.exports = {
    processedOrderCall
}