import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  form;
  printers;
  templates;
  openOrders;
  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getPrinters()
      .subscribe(printers=>{
        this.printers = printers;
      })

    this.orderService.getTemplates()
      .subscribe(templates=>{
        this.templates = templates;
      })
    this.form = new FormGroup({
      sku: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      printer: new FormControl('', {
        validators: [Validators.required]
      }),
      template: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  scan(){
    if(this.form.invalid || (this.form.value.printer == '' || this.form.value.template == '') ){
      this.form.setValue({
        sku: '', printer: '', template: ''
      })
      return
    }
    console.log(this.form.value)
  }
}
