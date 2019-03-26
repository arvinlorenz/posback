import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from '../../environments/environment';
import { TokenService } from "../shared/token.service";


@Injectable({providedIn:'root'})
export class AuthService{
    private authTokenUpdated = new Subject<any>();
    token:string;
    userId:string;
    constructor(private http: HttpClient,  private router: Router, private tokenService: TokenService){
    }

    getToken() {
        return this.token;
    }
    
    authTokenUpdateListener(){
        return this.authTokenUpdated.asObservable();
    }
       
    


    signinUser(email: string, password: string) {
        
        this.http.post(`${environment.apiUrl}/user`,{email,password})
            .subscribe((res:any)=>{
                this.token = res.token;
                this.saveAuthData(this.token, this.tokenService.getToken(), this.tokenService.getServer());
                this.authTokenUpdated.next(this.token);
                this.router.navigate(['/']);
            })
        
    }

    autoAuthUser() {
        const authInformation =  this.getAuthData();
        if(!authInformation){
            return;
        }
      
        this.token = authInformation.token;
        this.authTokenUpdated.next(this.token);
        
     }
 

    logout() {
       
        localStorage.removeItem('token');
        localStorage.removeItem('linnToken');
        localStorage.removeItem('linnServer');
        this.token = null;
        this.authTokenUpdated.next(this.token);
        
        this.router.navigate(['/login']);
      
    }

    private saveAuthData(token: string, linnworksToken: string, linnworksServer: string){
        localStorage.setItem('token', token);
        localStorage.setItem('linnToken', linnworksToken);
        localStorage.setItem('linnServer', linnworksServer);
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
       
        if(!token){
            return;
        }
        return {
            token,
        }


    }
    
    isAuthenticated() {
        if(this.token !=null){
            return true;
        }
        else{
            return false
        }
    
    }


}