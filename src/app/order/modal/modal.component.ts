import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService } from '../order.service';
import { SoundsService } from 'src/app/shared/sounds.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit{
  trackingNumber:string;
  successResponse;
  form;
  @ViewChild("trackingNumber") trackingField: ElementRef;
  constructor(public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public orderService: OrderService,
    public soundsService: SoundsService) { }

  ngOnInit() {
    this.trackingField.nativeElement.focus();
    this.form = new FormGroup({
      trackingNumber: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  closeDialog(responseData) {
    this.dialogRef.close(responseData);
  }
  processTrackingNumber(){

    this.orderService.addTrackingNumber(this.data.orderId, this.form.value.trackingNumber)
    .subscribe(responseData =>{
      this.orderService.processOrder(this.data.notHashedOrderId)
      .subscribe((responseData:any)=>{
        if(responseData.ProcessedState == 'PROCESSED'){
         
          this.orderService.incrementProcessCount(this.data.orderId);
          this.soundsService.playSuccess(); 
          this.orderService.setReturnResponse(responseData,this.data.orderId);
          this.data.form.reset();
          this.closeDialog(responseData);
          
        }
        
      })
    })
  }

}
