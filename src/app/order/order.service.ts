import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject, observable, interval } from "rxjs";
import { TokenService } from "../shared/token.service";
import * as moment from 'moment-timezone';
import { map, flatMap } from "rxjs/operators";
import { environment } from '../../environments/environment';
@Injectable({providedIn:'root'})
export class OrderService{
    processCount = 0;
    private processCountUpdated = new Subject<number>();
    returnResponse:{message:any,orderId:string};
    private returnResponseUpdated = new Subject<any>();

    openOrders;
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

    getOpenOrdersWithEdit(){
        let url = `${this.tokenService.getServer()}/api/Orders/GetOpenOrders`;
            let params = {
                entriesPerPage: 300,
                pageNumber: 1
                }
            const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
            return this.http.post(url,params,options)
                .pipe(map((order:any)=>{
   
                    return {
                        orders: order.Data.map(order=>{
                            
                            return {
                                NumOrderId: order.NumOrderId,
                                orderId: order.OrderId,
                                Company: order.CustomerInfo.Address.Company == '' ? '-' : order.CustomerInfo.Address.Company,
                                FullName: order.CustomerInfo.Address.FullName == '' ? '-' : order.CustomerInfo.Address.FullName,
                                Address1: order.CustomerInfo.Address.Address1 == '' ? '-' : order.CustomerInfo.Address.Address1,
                                Address2: order.CustomerInfo.Address.Address2 == '' ? '-' : order.CustomerInfo.Address.Address2,
                                Address3: order.CustomerInfo.Address.Address3 == '' ? '-' : order.CustomerInfo.Address.Address3,
                                Region: order.CustomerInfo.Address.Region == '' ? '-' : order.CustomerInfo.Address.Region,
                                Town: order.CustomerInfo.Address.Town == '' ? '-' : order.CustomerInfo.Address.Town,
                                PostCode: order.CustomerInfo.Address.PostCode == '' ? '-' : order.CustomerInfo.Address.PostCode,
                                Country: order.CustomerInfo.Address.Country == '' ? '-' : order.CustomerInfo.Address.Country,
                                EmailAddress: order.CustomerInfo.Address.EmailAddress == '' ? '-' : order.CustomerInfo.Address.EmailAddress,
                                PhoneNumber: order.CustomerInfo.Address.PhoneNumber == '' ? '-' : order.CustomerInfo.Address.PhoneNumber,
                                CountryId: order.CustomerInfo.Address.CountryId == '' ? '-' : order.CustomerInfo.Address.CountryId,

                            }
                        })
                    }
                }))
                .subscribe(orders=>{

                    let url = `${environment.apiUrl}/orders/checkOrderInDB`;
                    let params = {
                        ...orders
                        }
                        this.http.post(url,params)
                    .subscribe((res:any)=>{
                        this.openOrders = res.orders;
                        this.openOrdersUpdated.next(this.openOrders);
                    })
                    
                  })
    }

    
    updateOpenOrder(orderId,fieldAndValue, data){

        let info
        let url = `${this.tokenService.getServer()}/api/Orders/SetOrderCustomerInfo`;
        info = 
        {
            "ChannelBuyerName": "",
            Address:{
                ...data,    
                ...fieldAndValue
            }
            
        }
        
        delete info.Address.orderId;
        delete info.Address.NumOrderId;

        let params = {
            OrderId: orderId,
            info
            }
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
                let processDate = moment(order.date).tz('Australia/Sydney').format('YYYY/MM/DD');
                
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

    incrementProcessCount(orderNumber:string){
        let date = Date.now();
        let token = this.tokenService.getCredentials().token;
        this.http.post(`${environment.apiUrl}/orders`,{orderNumber,date,token})
        .subscribe(a=>{
            this.processCount++;
            this.processCountUpdated.next(this.processCount);
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
}