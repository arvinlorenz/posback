import { Component, OnInit } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TokenService } from './shared/token.service';
import { OrderService } from './order/order.service';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pos';

  constructor(private tokenService: TokenService, private authService: AuthService, private orderService: OrderService){}
  ngOnInit(){
    this.tokenService.getNewToken();
    this.authService.autoAuthUser();
    this.orderService.getOpenOrdersWithEdit()
    this.tokenService.tokenUpdateListener()
    .subscribe(a=>{
      this.orderService.loadCount();
      //this.tokenService.getNewToken();
    })
    ///this.tokenService.realTimeUpdateToken();

  }

}
