import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderService } from '../order.service';
import { SoundsService } from 'src/app/shared/sounds.service';
import { TokenService } from 'src/app/shared/token.service';

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
  @ViewChild("skuNumber") skuField: ElementRef;
  constructor(private orderService: OrderService, private soundService: SoundsService, private tokenService: TokenService) { }

  ngOnInit() {
    this.tokenService.tokenUpdateListener().subscribe(a=>{ 
      this.orderService.getPrinters()
      .subscribe(printers=>{
        this.printers = printers;
      })
      this.orderService.getTemplates()
      .subscribe((templates:any[])=>{
        let uniqueTems = [];
        this.templates = templates.filter(template=>{
          if(!uniqueTems.includes(template.TemplateType)){
            uniqueTems.push(template.TemplateType);
            return template;
          } 
        });
      })

    })
    this.orderService.getPrinters()
      .subscribe(printers=>{
        this.printers = printers;
      })

    this.orderService.getTemplates()
      .subscribe((templates:any[])=>{
        let uniqueTems = [];
        this.templates = templates.filter(template=>{
          if(!uniqueTems.includes(template.TemplateType)){
            uniqueTems.push(template.TemplateType);
            return template;
          } 
        });
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
      this.soundService.playError();
      this.form.setValue({
        sku: ''
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
            alert('Printing...')
            this.soundService.playSuccess();
            this.form.setValue({
              sku: ''
            })
            this.skuField.nativeElement.focus();
          }
          else{
            this.soundService.playError();
            this.form.setValue({
              sku: ''
            })
            this.skuField.nativeElement.focus();
          }
        })
     
        
      })
  }
}
