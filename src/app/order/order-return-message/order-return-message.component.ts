import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from '../order.service';
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-order-return-message',
  templateUrl: './order-return-message.component.html',
  styleUrls: ['./order-return-message.component.css']
})
export class OrderReturnMessageComponent implements OnInit, OnDestroy {
  getReturnResSub:Subscription;

  returnResponse;
  orderStatus;
  orderNumber;
  orderCustomerName;
  orderProcessDate;
  constructor(public orderService:OrderService) { }

  ngOnInit() {
    moment().tz("Australia/Sydney").format();
    this.getReturnResSub = this.orderService.getReturnResponseUpdateListener()
      .subscribe(res=>{
        
        if(res.message === 'NO DATA FOUND'){
          this.returnResponse = null;
        }

        else if(res.message.ProcessedState === 'PROCESSED'){
          console.log(this.returnResponse);
          this.returnResponse = res;
          this.orderStatus = this.returnResponse.message.ProcessedState;
          this.orderNumber = this.returnResponse.message.OrderSummary.NumOrderId ;
          this.orderCustomerName =  this.returnResponse.message.OrderSummary.CustomerName;
          
          var time = moment(this.returnResponse.message.OrderSummary.ProcessDate);
          this.orderProcessDate = time.tz('Australia/Sydney').format('ddd YYYY/MM/DD hh:mm a z');
        }

        //(res.ProcessedOrders.Data != undefined && res.ProcessedOrders.Data != null)
        else{
          console.log(res)
          this.returnResponse = res;
          this.orderStatus = 'Order already processed 訂單已處理完畢';
          this.orderNumber = this.returnResponse.orderId ;
          this.orderCustomerName =  this.returnResponse.message.ProcessedOrders.Data[0].cFullName;
          
        
          
          var time = moment(this.returnResponse.message.ProcessedOrders.Data[0].dProcessedOn);
          this.orderProcessDate = time.tz('Australia/Sydney').format('ddd YYYY/MM/DD hh:mm a z');
        }
        
        
        
      })
  }
  ngOnDestroy(){
    this.getReturnResSub.unsubscribe();
  }
}
