import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";


@Injectable({providedIn:'root'})
export class AuthService{
    private authTokenUpdated = new Subject<any>();
    token:string;
    userId:string;
    constructor(private http: HttpClient,  private router: Router){
    }

    getToken() {
        return this.token;
    }
    
    authTokenUpdateListener(){
        return this.authTokenUpdated.asObservable();
    }
       
    


    signinUser(email: string, password: string) {
        
        this.http.post('http://localhost:3000/api/user',{email,password})
            .subscribe((res:any)=>{
                this.token = res.token;

                this.authTokenUpdated.next(this.token);
                this.router.navigate(['/']);
            })
        
    }

    logout() {
       
        this.token = null;
        this.authTokenUpdated.next(this.token);
        this.router.navigate(['/login']);
      
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