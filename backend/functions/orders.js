const {credentials} = require('./token');
const {accountInfo} = require('./account-info');
const {openOrders} = require('./open-orders');
const {openOrdersCall} = require('./open-order-call');
const {searchProcessedOrder} = require('./search-processed-orders');
const {processedOrderCall} = require('./processed-order-call');

let checkAndSaveOrders = async()=>{
    let credentialsInfo = await credentials()
    try {
        let accountInformation = await accountInfo(credentialsInfo);

        let ainfo = {
            server: accountInformation.Server,
            token: accountInformation.Token
        }
        setInterval(async()=>{
            let openOrdersInfo = await openOrders(ainfo);
            let processedOrders = await searchProcessedOrder(ainfo); //within specific time
        
        
            Promise.all([openOrdersCall(openOrdersInfo),processedOrderCall({...ainfo, orders:processedOrders}) ])
            console.log('another 15mins.')
        }, 30000) //15minutes 900000
    } catch (error) {
        credentialsInfo();
    }
    

}

module.exports = {
	checkAndSaveOrders
};