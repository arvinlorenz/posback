const {credentials} = require('./token');
const {accountInfo} = require('./account-info');
const {openOrders} = require('./open-orders');
const {openOrdersCall} = require('./open-order-call');
const {searchProcessedOrder} = require('./search-processed-orders');
const {processedOrderCall} = require('./processed-order-call');

let checkAndSaveOrders = async()=>{
    console.log('get credentials')
    
    let credentialsInfo = await credentials()
    let accountInformation = await accountInfo(credentialsInfo);
    
        
    try {
        let ainfo = {
            server: accountInformation.Server,
            token: accountInformation.Token
        }
        setInterval(async()=>{
            let openOrdersInfo = await openOrders(ainfo);
            let processedOrders = await searchProcessedOrder(ainfo); //within specific time
        
        
            Promise.all([openOrdersCall(openOrdersInfo),processedOrderCall({...ainfo, orders:processedOrders}) ])
            console.log('another 1min.')
        }, 60000) //1min 
    } catch (error) {
         throw new Error('there is an error');
    }
    

}

module.exports = {
	checkAndSaveOrders
};