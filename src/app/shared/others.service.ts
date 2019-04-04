import { Injectable } from "@angular/core";
import { TokenService } from "./token.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";



@Injectable({providedIn:'root'})
export class OthersService{

    constructor(private http: HttpClient ,private tokenService:TokenService){}
    
    getShippingMethods(){
        let url = `${this.tokenService.getServer()}/api/Orders/GetShippingMethods`;
        let params = {  
        }

        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options)
    }

    getPackageGroupsAndTypes(){
        let url = `${this.tokenService.getServer()}/api/ShippingService/GetPackagingGroups`;
        let params = {  
        }

        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options)
    }


    
    
    
}