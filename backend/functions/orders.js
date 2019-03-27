const {credentials} = require('./token');
const {accountInfo} = require('./account-info');
const {openOrders} = require('./open-orders');
const {openOrdersCall} = require('./open-order-call');
const {searchProcessedOrder} = require('./search-processed-orders');
const {processedOrderCall} = require('./processed-order-call');
const {deleteProcessed} = require('../functions/delete-processed');
let checkAndSaveOrders = async()=>{
    console.log('get credentials')
            let credentialsInfo = await credentials()
            let accountInformation = await accountInfo(credentialsInfo);
        
            
        
            let ainfo = {
                server: accountInformation.Server,
                token: accountInformation.Token
            }
            
                let openOrdersInfo = await openOrders(ainfo);
                //let processedOrders = await searchProcessedOrder(ainfo); //within specific time
    
               
                //Promise.all([openOrdersCall({linnworksToken: credentialsInfo.token,orders:openOrdersInfo}),processedOrderCall({...ainfo,orders:processedOrders,linnworksToken: credentialsInfo.token}) ])
                Promise.all([openOrdersCall({linnworksToken: credentialsInfo.token,orders:openOrdersInfo}) ])
                deleteProcessed({orders:openOrdersInfo})
                console.log('starting 1min.count for '+ accountInformation.FullName)
    try {
        setInterval(async()=>{
             credentialsInfo = await credentials()
             accountInformation = await accountInfo(credentialsInfo);
        
            
        
             ainfo = {
                server: accountInformation.Server,
                token: accountInformation.Token
            }
            
                 openOrdersInfo = await openOrders(ainfo);
                 //processedOrders = await searchProcessedOrder(ainfo); //within specific time
                //Promise.all([openOrdersCall({...ainfo,orders:openOrdersInfo}),processedOrderCall({...ainfo, orders:processedOrders}) ])
                Promise.all([openOrdersCall({linnworksToken: credentialsInfo.token,orders:openOrdersInfo}) ])
                deleteProcessed({orders:openOrdersInfo})
                console.log('another 1min. for '+ accountInformation.FullName)
            }, 60000) //1min 
    } catch (error) {
         throw new Error('there is an error');
    }
    

}

module.exports = {
	checkAndSaveOrders
};