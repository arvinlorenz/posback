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

    getOpenOrders(){
       interval(900000).subscribe(()=>{
        let url = `${this.tokenService.getServer()}/api/Orders/GetOpenOrders`;
            let params = {
                entriesPerPage: 100,
                pageNumber: 1
                }
            const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
            this.http.post(url,params,options)
                .subscribe((orders:any)=>{
                    

                    let url = `${environment.apiUrl}/orders/open`;
                    let params = {
                        orders
                        }
                    this.http.post(url,params)
                        .subscribe((orders:any)=>{
                           this.openOrders = orders.openOrders;
                           this.openOrdersUpdated.next(this.openOrders);
                        })


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
            let now = moment(Date.now()).tz('Australia/Sydney').format('YYYY/MM/DD');
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
    
}