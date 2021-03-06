import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject, observable, interval } from "rxjs";
import { TokenService } from "../shared/token.service";
import * as moment from 'moment-timezone';
import { map, flatMap, filter } from "rxjs/operators";
import { environment } from '../../environments/environment';
@Injectable({providedIn:'root'})
export class OrderService{
    processCount = 0;
    private processCountUpdated = new Subject<number>();

    processedOrders: any[] = [];
    private processedOrdersUpdated = new Subject<any[]>();

    returnResponse:{message:any,orderId:string};
    private returnResponseUpdated = new Subject<any>();

    openOrders = [];
    private openOrdersUpdated = new Subject<any>();


    constructor(private http: HttpClient, private router: Router, private tokenService: TokenService){
    }

    getCountries(){
        let url = `${this.tokenService.getServer()}/api/Orders/GetCountries`;
       
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,{}, options,);
    }

    
    // getOpenOrders(){
       
    //     let url = `${this.tokenService.getServer()}/api/Orders/GetOpenOrders`;
    //         let params = {
    //             entriesPerPage: 100,
    //             pageNumber: 1
    //             }
    //         const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
    //         this.http.post(url,params,options)
    //             .subscribe((orders:any)=>{
                    

    //                 let url = `${environment.apiUrl}/orders/open`;
    //                 let params = {
    //                     orders
    //                     }
    //                 this.http.post(url,params)
    //                     .subscribe((orders:any)=>{
                           
    //                     })


    //             })
            
    // }
    // getProcessedOrders(){ //within unchecked minutes
    //     let from = `${moment(Date.now()).tz('Australia/Sydney').add(1, 'hours').subtract(15, 'minutes').format('YYYY-MM-DD hh:mm:ss')}`;
    //     let to = `${moment(Date.now()).tz('Australia/Sydney').add(1, 'hours').format('YYYY-MM-DD hh:mm:ss')}`;
        
    //     let url = `${this.tokenService.getServer()}/api/ProcessedOrders/SearchProcessedOrders`;
    //         let params = {
    //                 request: {
    //                     "SearchTerm":"",
    //                     "SearchFilters":null,
    //                     "DateField":"received",
    //                     "FromDate":from,
    //                     "ToDate":to,
    //                     "PageNumber":1,
    //                     "ResultsPerPage":500,
    //                     "SearchSorting":null
    //                 }
    //             }
    //         const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
            
    //         this.http.post(url,params,options)
    //             .subscribe((orders:any)=>{
                    
    //                 let url = `${environment.apiUrl}/orders/processed`;
    //                 let params = {
    //                     token: this.tokenService.getToken(),
    //                     server: this.tokenService.getServer(),
    //                     orders: orders.ProcessedOrders.Data
    //                     }
    //                 this.http.post(url,params)
    //                     .subscribe((proccedOrders:any)=>{
    //                        console.log("proccedOrders",proccedOrders)
    //                     })


    //             })
            
    // }
    fetchOpenOrders(){
        let url = `${environment.apiUrl}/orders/fetchOpenOrders`;
        let params = {}
            this.http.post(url,params)
        .subscribe((res:any)=>{
            this.openOrders = [...this.openOrders, ...res.orders ]
             this.openOrdersUpdated.next(this.openOrders);
        })
    }

    getOpenOrders(){
        return this.openOrders;
    }
    
    getOrderById(orderId){
        let url = `${this.tokenService.getServer()}/api/Orders/GetOrder`;
            let params = {
                orderId,
                fulfilmentLocationId: "00000000-0000-0000-0000-000000000000",
                loadItems: false,
                loadAdditionalInfo: false
                }
            const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return this.http.post(url,params, options)


    }
    getOrderNoteById(orderId){
        let url = `${this.tokenService.getServer()}/api/Orders/GetOrderNotes`;
            let params = {
                orderId
                }
            const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return this.http.post(url,params, options)


    }
    getProcessedOrders(){
        this.http.get(`${environment.apiUrl}/orders`, {
            observe: 'body',
            responseType: 'json'
          })
          .pipe(
            
            map((orders:any)=>{
            
            if(orders === null){
                return []
            }
            let now = moment(Date.now()).tz('Australia/Sydney').add(1, 'hours').format('YYYY/MM/DD');
            let accountPermaToken = this.tokenService.getCredentials().token;

            return orders.orders.filter((order:any) =>{
                
                let processDate = moment(order.date).format('YYYY/MM/DD');

                if(processDate === now && accountPermaToken === order.token){
                    return true
                }
                
            })
          }),
          map((orders:any)=>{
            return orders.map(order=>{
                
                return {
                    ...order,
                    date:  moment(order.date).format('DD/MMM/YYYY HH:mm:ss A')
                }
            })
            }),
          )
        .subscribe((orders:any)=>{
           
            this.processedOrders = orders;
            this.processedOrdersUpdated.next(this.processedOrders);
        })
    }

    getProcessedOrdersUpdateListener(){
        return this.processedOrdersUpdated.asObservable();
    }

    getOpenOrdersWithEdit(){
        let url = `${environment.apiUrl}/orders/getOpenOrdersFromMongo`;
            let params = {
                }
                this.http.post(url,params)
                .pipe(map((orderRes:any)=>{
    
                    return {
                        orders: orderRes.openOrders.map(order=>{
                           
                            return {
                                orderId: order.OrderId,
                                NumOrderId: order.NumOrderId,
                                Company: order.CustomerInfo.Address.Company,
                                FullName: order.CustomerInfo.Address.FullName,
                                Address1: order.CustomerInfo.Address.Address1,
                                Address2: order.CustomerInfo.Address.Address2,
                                Address3: order.CustomerInfo.Address.Address3,
                                Region: order.CustomerInfo.Address.Region,
                                Town: order.CustomerInfo.Address.Town,
                                PostCode: order.CustomerInfo.Address.PostCode,
                                Country: order.CustomerInfo.Address.Country,
                                EmailAddress: order.CustomerInfo.Address.EmailAddress,
                                PhoneNumber: order.CustomerInfo.Address.PhoneNumber,
                                CountryId: order.CustomerInfo.Address.CountryId,
                                Revenue: order.TotalsInfo.TotalCharge
                            }
                        })
                    }
                }))
                .subscribe((res: any)=>{
                    console.log(res)
                     this.openOrders = res.orders;
                     this.openOrdersUpdated.next(this.openOrders);
                })
    }

    //this is not working
    getOpenOrdersWithEditOLDONE(){
        let orderIdArrayResponse = []
        let url = `${this.tokenService.getServer()}/api/Orders/GetOpenOrders`;
            let params = {
                entriesPerPage: 1000,
                pageNumber: 1
                }
            const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
            return this.http.post(url,params,options)
                .pipe(map((order:any)=>{
                    
                    return {
                        orders: order.Data.map(order=>{
                            return order.OrderId
                            //return {
                                //orderId: order.OrderId,
                                // NumOrderId: order.NumOrderId,
                                // Company: order.CustomerInfo.Address.Company,
                                // FullName: order.CustomerInfo.Address.FullName,
                                // Address1: order.CustomerInfo.Address.Address1,
                                // Address2: order.CustomerInfo.Address.Address2,
                                // Address3: order.CustomerInfo.Address.Address3,
                                // Region: order.CustomerInfo.Address.Region,
                                // Town: order.CustomerInfo.Address.Town,
                                // PostCode: order.CustomerInfo.Address.PostCode,
                                // Country: order.CustomerInfo.Address.Country,
                                // EmailAddress: order.CustomerInfo.Address.EmailAddress,
                                // PhoneNumber: order.CustomerInfo.Address.PhoneNumber,
                                // CountryId: order.CustomerInfo.Address.CountryId,

                            //}
                        })
                    }
                }))
                .subscribe(orderIds=>{
                    
                    let url = `${environment.apiUrl}/orders/checkOrderInDB`;
                    let params = {
                        orderIds: orderIds.orders
                        }
                        this.http.post(url,params)
                    .subscribe((res:any)=>{
    
                       orderIdArrayResponse = res.orderIds

                       let url = `${this.tokenService.getServer()}/api/Orders/GetOpenOrders`;
                        let params = {
                            entriesPerPage: 1000,
                            pageNumber: 1
                            }
                        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
                        return this.http.post(url,params,options)
                            .pipe(map((order:any)=>{
                                
                                return {
                                    orders: order.Data.map(order=>{
                                       
                                        return {
                                            orderId: order.OrderId,
                                            NumOrderId: order.NumOrderId,
                                            Company: order.CustomerInfo.Address.Company,
                                            FullName: order.CustomerInfo.Address.FullName,
                                            Address1: order.CustomerInfo.Address.Address1,
                                            Address2: order.CustomerInfo.Address.Address2,
                                            Address3: order.CustomerInfo.Address.Address3,
                                            Region: order.CustomerInfo.Address.Region,
                                            Town: order.CustomerInfo.Address.Town,
                                            PostCode: order.CustomerInfo.Address.PostCode,
                                            Country: order.CustomerInfo.Address.Country,
                                            EmailAddress: order.CustomerInfo.Address.EmailAddress,
                                            PhoneNumber: order.CustomerInfo.Address.PhoneNumber,
                                            CountryId: order.CustomerInfo.Address.CountryId,

                                        }
                                    }).filter(order=>{
                                        return orderIdArrayResponse.includes(order.orderId)
                                    })
                                }
                            }))
                            .subscribe(res=>{
                                 this.openOrders = res.orders;
                                 this.openOrdersUpdated.next(this.openOrders);
                            })
                    })
                    
                    
                  })
    }

    
    updateOpenOrder(orderId,fieldAndValue, data){

        let info
        let url = `${this.tokenService.getServer()}/api/Orders/SetOrderCustomerInfo`;
        info = 
        {
            "ChannelBuyerName": "",
            "Address":{
                ...data,    
                ...fieldAndValue
            }
            
        }
        
        delete info.Address.orderId;
        delete info.Address.NumOrderId;

        let params = {
            orderId,
            info
            }
        console.log(params)
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
         this.http.post(url,params,options)
            .subscribe(()=>{

                let url = `${environment.apiUrl}/orders/open`;
                    let params = {
                            OrderId: orderId,
                            info
                        }
                    this.http.patch(url,params)
                        .subscribe((orders:any)=>{
                           
                        })
            })
    }

    
    openOrdersUpdatedListener(){
        return this.openOrdersUpdated.asObservable();
    }
    
    getCount(){
        return this.processCount;
    }
    loadCount(){
        this.http.get(`${environment.apiUrl}/orders`, {
            observe: 'body',
            responseType: 'json'
          })
          .pipe(map((orders:any)=>{
            
            if(orders === null){
                return []
            }
            let now = moment(Date.now()).tz('Australia/Sydney').add(1, 'hours').format('YYYY/MM/DD');
            let accountPermaToken = this.tokenService.getCredentials().token;
            return orders.orders.filter((order:any) =>{
                let processDate = moment(order.date).format('YYYY/MM/DD');
                if(processDate === now && accountPermaToken === order.token){
                    return true
                }
                
            })
          }))
        .subscribe(orders=>{
            
            this.processCount = orders.length;
            this.processCountUpdated.next(this.processCount);
        })
    }

    incrementProcessCount(orderNumber:string, name:string){
        
        let date =  moment(Date.now()).tz('Australia/Sydney').add(1, 'hours').format('DD/MMM/YYYY hh:mm:ss A')
        let token = this.tokenService.getCredentials().token;
        this.http.post(`${environment.apiUrl}/orders`,{orderNumber,name,date,token})
        .subscribe(a=>{
            this.processCount++;
            this.processCountUpdated.next(this.processCount);
            this.processedOrders = [...this.processedOrders, {orderNumber,name,date,token}]
            

            let indexOfOpen = this.openOrders.findIndex(i => i.NumOrderId === orderNumber); 
            this.openOrders.splice(indexOfOpen,1);

            this.openOrdersUpdated.next([...this.openOrders])
            this.processedOrdersUpdated.next(this.processedOrders);
        })

    }
    
    getProcessCountUpdateListener(){
        return this.processCountUpdated.asObservable();
    }



    setReturnResponse(message,orderId){
        this.returnResponse = {message,orderId};
        this.returnResponseUpdated.next(this.returnResponse);
    }

    getReturnResponseUpdateListener(){
        return this.returnResponseUpdated.asObservable();
    }

    
  
    processOrder(orderId:string){
      
        let url = `${this.tokenService.getServer()}/api/Orders/ProcessOrderByOrderOrReferenceId`;
        let params = {
            request:{
                "OrderOrReferenceId": orderId,
                "LocationId": "00000000-0000-0000-0000-000000000000",
                "ScansPerformed": true,
                "OrderProcessingNotesAcknowledged": true
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options,);
    }

    addTrackingNumber(orderId:string, trackingNumber: string){
        let url = `${this.tokenService.getServer()}/api/Orders/SetOrderShippingInfo`;
        let params = {
            orderID: orderId,
            info:{
                "PostalServiceId": "00000000-0000-0000-0000-000000000000",
                "TrackingNumber": trackingNumber,
                "ManualAdjust": true
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    searchProcessedOrders(orderId:string){
        let url = `${this.tokenService.getServer()}/api/ProcessedOrders/SearchProcessedOrders`;
        let params = {
            request:{
                "SearchTerm": orderId,
                "PageNumber": 1,
                "ResultsPerPage": 20,
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    

    getPrinters(){
        let url = `${this.tokenService.getServer()}/api/PrintService/VP_GetPrinters`;
        let params = {}
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    getTemplates(){
        let url = `${this.tokenService.getServer()}/api/PrintService/GetTemplateList`;
        let params = {}
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    getOpenOrdersToPrint(sku:string, printer:string, template:string){
        let url = `${this.tokenService.getServer()}/api/Orders/GetOpenOrders`;
        let params = {
            entriesPerPage: 100,
            pageNumber: 1,
            additionalFilter: 'SKU:'+sku
        }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options)
    }

    createPDF(IDs:any[], printerName:string, printerLocation, templateId:string, templateType:string){
        let url = `${this.tokenService.getServer()}/api/PrintService/CreatePDFfromJobForceTemplate`;
        let params = {
            templateType,
            IDs,
            printerName: printerLocation+'\\'+printerName            
        }

        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options)
    }
}