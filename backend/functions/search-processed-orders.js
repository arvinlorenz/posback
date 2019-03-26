const axios = require('axios');
const moment = require("moment-timezone");



let searchProcessedOrder = async(info)=>{
    let from = `${moment(Date.now()).tz('Australia/Sydney').add(1, 'hours').subtract(3, 'minutes').format('YYYY-MM-DD hh:mm:ss')}`;
    let to = `${moment(Date.now()).tz('Australia/Sydney').add(1, 'hours').format('YYYY-MM-DD hh:mm:ss')}`;
    console.log(from,to)
    let url = `${info.server}/api/ProcessedOrders/SearchProcessedOrders`
    let params = {
        request: {
            "SearchTerm":"",
            "SearchFilters":null,
            "DateField":"received",
            "FromDate":from,
            "ToDate":to,
            "PageNumber":1,
            "ResultsPerPage":500,
            "SearchSorting":null
        }
    }
    let headers = {
        
        'Authorization': info.token 
    }
    try {
        let orders =  await axios.post(url,params,{headers});
        return orders.data.ProcessedOrders.Data
  
    } catch (error) {
        console.log(error)
    }
     
}
    
module.exports = {
    searchProcessedOrder
}