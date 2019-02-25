import { Component, OnInit } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TokenService } from './shared/token.service';
import { OrderService } from './order/order.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pos';

  constructor(private tokenService: TokenService, private orderService: OrderService){}
  ngOnInit(){
    this.tokenService.getNewToken();
    this.tokenService.tokenUpdateListener()
    .subscribe(a=>{
      this.orderService.loadCount();
    })
    ///this.tokenService.realTimeUpdateToken();
    
  }

}
