import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from '../../environments/environment';
import { TokenService } from "../shared/token.service";
import { map } from "rxjs/operators";


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
        let url = `${environment.apiUrl}/user`;
        let params = {
            email,password
            }
        this.http.post(url,params)
            
            .subscribe((res:any)=>{
                if(res.message === 'Auth failed'){
                    console.log('Auth failed')
                    this.token = null;
                    this.authTokenUpdated.next(this.token);
                    
                }
                else{
                    this.token = res.token;
                    this.saveAuthData(this.token, this.tokenService.getToken(), this.tokenService.getServer());
                    this.authTokenUpdated.next(this.token);
                }
              
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