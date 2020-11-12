import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';

@Injectable({providedIn:'root'})
export class TokenService{

    createCredentials
    token;
    server;
    accountFullname
    private tokenUpdated = new Subject<any>();
    private nameUpdated = new Subject<any>();
    ErrorAudio: HTMLAudioElement = new Audio('sounds/error.wav');
    SuccessAudio: HTMLAudioElement = new Audio('sounds/success.wav');

    constructor(private http: HttpClient, private router: Router){
    }

    playSuccess(){
        this.SuccessAudio.play();
    }
    playError(){
        this.ErrorAudio.play();
    }
    getName(){
        return this.accountFullname;
    }
    getToken(){
        //return this.token || localStorage.getItem('linnToken');
        return localStorage.getItem('linnToken');
    }
    getServer(){
        return this.server || localStorage.getItem('linnServer');
    }
    getCredentials(){
        return this.createCredentials;
    }

    tokenUpdateListener(){
        return this.tokenUpdated.asObservable();
    }
    nameUpdateListener(){
        return this.nameUpdated.asObservable();
    }
    // realTimeUpdateToken(){
    //     this.apiTokenRef.valueChanges().subscribe(a=>{
    //         console.log(a)
    //     })
    // }
    getNewToken(){
        console.log(environment.apiDB)
        this.http.get(`${environment.apiUrl}/token`)
        .subscribe((tokenRes:any)=>{
            let params = { token : tokenRes.token,
                        applicationId : tokenRes.applicationId,
                        applicationSecret : tokenRes.applicationSecret };
            this.createCredentials = {
                                        // id: tokenRes.id,
                                        token : tokenRes.token,
                                        applicationId : tokenRes.applicationId,
                                        applicationSecret : tokenRes.applicationSecret };

            console.log(this.createCredentials);

            this.http
            .get(
                "https://api.linnworks.net/api/Auth/AuthorizeByApplication",
                {params}
            )
            .subscribe((responseData:any) => {
                console.log('SAVED')
                this.accountFullname = responseData.FullName;
                this.token = responseData.Token;
                localStorage.setItem('linnToken', this.token);

                this.server = responseData.Server;
                localStorage.setItem('linnServer', this.server);
                this.tokenUpdated.next(this.token);
                this.nameUpdated.next(this.accountFullname);
            });
        })



        //TEST
        //  let params = { token : '17568c13cd21c66574768a82d927f697',
        //                 applicationId : 'db3695da-e3b3-4d92-8981-5d8dee809f46',
        //                 applicationSecret : '2004f0b7-9dae-4a95-9337-feaf450ef996' };



                // //LIVE
                //         let params = { token : 'd1ded4727d8204b3f3ca88c475a24533',
                //         applicationId : 'f01c4825-1eaa-4ad7-88da-74dec836d94a',
                //         applicationSecret : '9bef39a1-0376-4b48-8b06-2142fe3c98c5' };




    }


    updateToken(token:string,applicationId:string,applicationSecret:string){
        let params = { token, applicationId, applicationSecret};
        this.http
            .get(
                "https://api.linnworks.net/api/Auth/AuthorizeByApplication",
                {params}
            )
            .subscribe((tokenRes: any)=>{
                let id = this.getCredentials().id;
                this.http.put(`${environment.apiUrl}/token/${id}`, params)
                   .subscribe((response:any)=>{
                       console.log(response.message)
                       if(response.message == 'Update successful')
                        this.playSuccess();
                        this.createCredentials = { ...this.createCredentials, token, applicationId, applicationSecret};
                        this.accountFullname = tokenRes.FullName;
                        this.token = tokenRes.Token;
                        localStorage.setItem('linnToken', this.token);
                        this.server = tokenRes.Server;
                        localStorage.setItem('linnServer', this.server);
                        this.tokenUpdated.next(this.token);
                        this.nameUpdated.next(this.accountFullname);
                    })

            },
            err => {
                this.playError();
            })



    }

    getNewTokenFake(){
        this.http.get('https://arvin-8a261.firebaseio.com/apiToken.json')
        .subscribe((tokenRes:any)=>{
            let params = { token : "17568c13cd21c66574768a82d927f697dfs",
                        applicationId : "db3695da-e3b3-4d92-8981-5kamoted8dee809f46",
                        applicationSecret : "2004f0b7-9dae-4a95-93dkjf37-feaf450ef996" };
            this.createCredentials = params;

            this.http
            .get(
                "https://api.linnworks.net/api/Auth/AuthorizeByApplication",
                {params}
            )
            .subscribe((responseData:any) => {
                this.accountFullname = responseData.FullName;
                this.token = responseData.Token;
                this.server = responseData.Server;
                this.tokenUpdated.next(this.token);
                this.nameUpdated.next(this.accountFullname);
            });
        })
    }

}
