import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderService } from '../order.service';
import { SoundsService } from 'src/app/shared/sounds.service';

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
  constructor(private orderService: OrderService, private soundService: SoundsService) { }

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
 
     let printer = this.form.value.printer;
     let templateId = this.form.value.template;
     let templateType = this.templates.filter(template=>{
       return template.TemplateId === templateId
     })[0].TemplateType;

     
     let printerLocation = this.printers.filter(printerEach=>{
      return printerEach.PrinterName === printer
    })[0].PrinterLocationName;
 
     let IDs;

    this.orderService.getOpenOrdersToPrint(this.form.value.sku,this.form.value.printer,this.form.value.template)
      .subscribe((orders:any)=>{
        this.openOrders = orders.Data.filter(order=>{
          return order.FolderName[0] == "Address Checked - Single"
        })
        IDs = this.openOrders.map(orders=>{
          return orders.OrderId
        });

        this.orderService.createPDF(IDs, printer,printerLocation, templateId, templateType)
        .subscribe((a:any)=>{
          console.log(a)
          if(a.KeyedError.length == 0){
            this.soundService.playSuccess();
          }
          else{
            this.soundService.playError();
          }
        })
     
        
      })
  }
}
