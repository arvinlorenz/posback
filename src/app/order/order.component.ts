import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog} from '@angular/material';

import { OrderService } from './order.service';
import { ModalComponent } from './modal/modal.component';
import { Subscription, interval, Subject } from 'rxjs';
import { SoundsService } from '../shared/sounds.service';
import { TokenService } from '../shared/token.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  lang = 'en';
  processCount:number = 0;
  processOrders;
  pCountSub: Subscription;
  form: FormGroup;
  tokenSub: Subscription;
  getProcessedOrdersSub: Subscription;
  tokenAvailable = false;

  openOrders = 0;

  dtOptions = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild("orderNumber") orderField: ElementRef;
  


  constructor(
    private orderService: OrderService,
    private soundsService: SoundsService,
    private tokenService: TokenService,
    public dialog: MatDialog,
    public route: ActivatedRoute) { }

    
  ngOnInit() {
   

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      order: [[ 0, 'desc' ]],
      "dom": '<"top"i>frt<"bottom"lp><"clear">',
      processing: true,
      rowReorder: {
        selector: 'td:nth-child(2)'
      },
      responsive: true
    };

   

    
    
    this.orderField.nativeElement.focus();
    this.processCount = this.orderService.getCount();

    this.tokenSub = this.tokenService.tokenUpdateListener()
      .subscribe(res=>{
        this.tokenAvailable = true; 
        this.form.controls.orderNumber.enable();
        this.orderField.nativeElement.focus();
      })
    this.orderService.getProcessedOrders();
    this.getProcessedOrdersSub = this.orderService.getProcessedOrdersUpdateListener()
      .subscribe(orders=>{
        this.processOrders = orders;
        $('#table').DataTable().destroy()
        this.dtTrigger.next();
        console.log(this.processOrders)
      })
      this.form = new FormGroup({
        orderNumber: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(6)]
        })
      });
      
      if(this.tokenService.getToken() != null){
        this.form.controls.orderNumber.enable();
      }
      
      else{
        this.form.controls.orderNumber.disable();
      }

    this.pCountSub = this.orderService.getProcessCountUpdateListener().subscribe(processCount=>{
      this.processCount = processCount;
    })
  }
 
  processOrder(){

    if(this.form.invalid){
      this.form.reset();
      this.soundsService.playError(); 
      return;
    }
    this.orderService.processOrder(this.form.value.orderNumber).subscribe((responseData:any) => {
      console.log(responseData)
          if(responseData.ProcessedState == 'PROCESSED'){
            this.orderService.incrementProcessCount(this.form.value.orderNumber,responseData.OrderSummary.CustomerName);
            this.orderService.setReturnResponse(responseData,this.form.value.orderNumber);
            this.soundsService.playSuccess();  
            this.form.reset();
            this.orderField.nativeElement.focus();
          }
  
  
  
  
  
          else if(responseData.ProcessedState === 'NOT_PROCESSED'){
            
            console.log(responseData.Message)
              if(responseData.Message.indexOf('tracking number') !== -1){
                  const dialogRef = this.dialog.open(ModalComponent, {
                    width: '250px',
                    data: {orderId: responseData.OrderId,orderNumber: this.form.value.orderNumber, notHashedOrderId: this.form.value.orderNumber, form: this.form}
                  });
                  this.soundsService.playError(); 
                  dialogRef.afterClosed().subscribe(result => {   
                    this.orderField.nativeElement.focus();
                  });
      
                  this.orderField.nativeElement.focus();
                    
              }
            
              else{
                this.soundsService.playError(); 
                //this.orderService.setReturnResponse(responseData);
                
              }
          }
  
  
  
  
  
  
          else if(responseData.ProcessedState === 'NOT_FOUND'){
  
            this.orderService.searchProcessedOrders(this.form.value.orderNumber).subscribe((processedRes:any)=>{
              if(processedRes.ProcessedOrders.Data.length > 0){
                this.orderService.setReturnResponse(processedRes,this.form.value.orderNumber);
                this.soundsService.playError(); 
                this.form.reset();
              }
              else{
                this.orderService.setReturnResponse('NO DATA FOUND',this.form.value.orderNumber); 
                this.form.reset();
                this.soundsService.playError(); 
              }
            })
            this.orderField.nativeElement.focus();
          }
  
  
  
          // else if(responseData.Message === 'Invalid applicationId or applicationsecret.'){
          //   this.tokenService.getNewToken();
          //   this.tokenService.tokenUpdateListener()
          //     .subscribe(a=>{
          //       this.processOrder();
          //     })
          // }
  
          
          else{
            this.soundsService.playError(); 
            this.orderField.nativeElement.focus();
           
          }
        

       

        
    })
  }

  ngOnDestroy(){
    this.pCountSub.unsubscribe();
    this.getProcessedOrdersSub.unsubscribe();
    this.tokenSub.unsubscribe();
  }

}
