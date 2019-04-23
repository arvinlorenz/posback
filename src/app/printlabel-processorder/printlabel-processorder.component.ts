import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../order/order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OthersService } from '../shared/others.service';
import { SoundsService } from '../shared/sounds.service';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../order/modal/modal.component';

@Component({
  selector: 'app-printlabel-processorder',
  templateUrl: './printlabel-processorder.component.html',
  styleUrls: ['./printlabel-processorder.component.css']
})
export class PrintlabelProcessorderComponent implements OnInit {
  @ViewChild("orderNumber") orderField: ElementRef;
  autoprocess:boolean = false;
  autoprint:boolean = false;
  autoprintlabel:boolean = false;
  autoprintinvoice:boolean = false;

  printer; 
  template;

  orderIds;
  orderNotes;
  form;
  orderEntered = false;
  name
  company
  address1
  address2
  address3
  town
  region
  postcode
  phone
  email

  formDisplay;
  shippingMethodSelected
  packagingGroupSelected
  packagingTypeSelected

  shippingMethodArray
  packagingGroupArray
  packagingGroupTypeArrayAll
  packagingTypeArray

  printers
  templates
  constructor(
    private orderService: OrderService, 
    private otherService: OthersService, 
    private soundsService: SoundsService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.orderIds = this.orderService.getOpenOrders().map(order=>{
      return {shortId: order.NumOrderId, longId:order.orderId}
    })

    this.otherService.getShippingMethods()
    .subscribe((methods:any[])=>{
      this.shippingMethodArray = methods.reduce((methodArray, method)=>{
        methodArray.push(...method.PostalServices.map(eachMethod=>{
          return eachMethod
        }))

        return methodArray

      },[])
    })

    this.orderService.getPrinters()
      .subscribe(printers=>{
        this.printers = printers;
      })
      this.orderService.getTemplates()
      .subscribe((templates:any[])=>{
        this.templates = templates
        // let uniqueTems = [];
        // console.log(templates)
        // this.templates = templates.filter(template=>{
        //   if(!uniqueTems.includes(template.TemplateType)){
        //     uniqueTems.push(template.TemplateType);
        //     return template;
        //   } 
        // });
      })

    this.otherService.getPackageGroupsAndTypes()
    .subscribe((groupsAndTypes: any[])=>{
      
      this.packagingGroupArray = groupsAndTypes.map(groupsAndType=>{
        return {
          packagingGroupId: groupsAndType.PackagingGroupId,
          packagingGroupName: groupsAndType.PackagingGroupName,
        }
      });
      
      
      this.packagingGroupTypeArrayAll = groupsAndTypes.map(groupsAndType=>{
        return {
          packagingGroupId: groupsAndType.PackagingGroupId,
          packagingTypes: groupsAndType.PackagingTypes

          }
        })
    })
    this.orderField.nativeElement.focus();
    this.form = new FormGroup({
      orderNumber: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
    });
    this.formDisplay = new FormGroup({
      shippingMethod: new FormControl(null),
      packagingGroup: new FormControl(null),
      packagingType: new FormControl(null),
    });
    this.formDisplay.controls.shippingMethod.disable();
    this.formDisplay.controls.packagingGroup.disable();
    this.formDisplay.controls.packagingType.disable();
  }
  printerSelected(e){
    this.printer = e.target.value
  }
  templateSelected(e){
    this.template = e.target.value
  }
  toggle({checked},checkboxName){
    if(checkboxName === 'autoprocess'){
      this.autoprocess = checked ? true : false
    }
    if(checkboxName === 'autoprint'){
      this.autoprint = checked ? true : false
    }
    if(checkboxName === 'autoprintlabel'){
      this.autoprintlabel = checked ? true : false
    }
    if(checkboxName === 'autoprintinvoice'){
      this.autoprintinvoice = checked ? true : false
    }
    console.log(this.autoprocess,this.autoprint)
  }
  onChangePackageGroup(event){

    console.log(event.value)
    this.packagingTypeArray = this.packagingGroupTypeArrayAll.find(type=>{
      return type.packagingGroupId === event.value
    })
    this.packagingTypeArray = this.packagingTypeArray.packagingTypes
  }
  findOrder(){
    this.formDisplay.controls.shippingMethod.disable();
    this.formDisplay.controls.packagingGroup.disable();
    this.formDisplay.controls.packagingType.disable();
    this.packagingGroupSelected = '';
    let order = this.orderIds.find(order=>{
      return order.shortId === this.form.value.orderNumber
    })
    console.log(order)
    if(order){
      this.orderEntered = true;
      this.orderService.getOrderById(order.longId)
        .subscribe((res:any)=>{
          this.name = res.CustomerInfo.Address.FullName;
          this.company = res.CustomerInfo.Address.Company;
          this.address1 = res.CustomerInfo.Address.Address1;
          this.address2 = res.CustomerInfo.Address.Address2;
          this.address3 = res.CustomerInfo.Address.Address3;
          this.town = res.CustomerInfo.Address.Town;
          this.region = res.CustomerInfo.Address.Region;
          this.postcode = res.CustomerInfo.Address.PostCode;
          this.phone = res.CustomerInfo.Address.PhoneNumber;
          this.email = res.CustomerInfo.Address.EmailAddress;
          this.shippingMethodSelected = res.ShippingInfo.PostalServiceId;
          this.packagingGroupSelected = res.ShippingInfo.PackageCategoryId;
          this.packagingTypeSelected = res.ShippingInfo.PackageTypeId;

          this.packagingTypeArray = this.packagingGroupTypeArrayAll.find(type=>{
            return type.packagingGroupId === this.packagingGroupSelected
          })
          this.packagingTypeArray = this.packagingTypeArray.packagingTypes
          this.formDisplay.controls.shippingMethod.enable();
          this.formDisplay.controls.packagingGroup.enable();
          this.formDisplay.controls.packagingType.enable();
          this.formDisplay.setValue({shippingMethod:this.shippingMethodSelected, packagingGroup:this.packagingGroupSelected, packagingType:this.packagingTypeSelected })
          
        })
      
        this.orderService.getOrderNoteById(order.longId)
        .subscribe((res:any)=>{
          this.orderNotes = res.map(note=>{
            return note.Note
          })
        })


        // if autoprocess
        if(this.autoprocess){
          this.processOrder(order)
        }
        if(this.autoprintlabel){
          this.printLabel(order)
        }
    }
  }
  
  printLabel({longId}){
    let printerLocation = this.printers.filter(printerEach=>{
      return printerEach.PrinterName === this.printer
    })[0].PrinterLocationName;

    let templateType = this.templates.filter(template=>{
      return template.TemplateId === template
    })[0].TemplateType;

    this.orderService.createPDF([longId], this.printer,printerLocation, this.template, templateType)
        .subscribe((a:any)=>{
          console.log(a)
          if(a.KeyedError.length == 0){
            alert('Printing...')
            this.soundsService.playSuccess();
            this.form.setValue({
              sku: ''
            })
          }
          else{
            this.soundsService.playError();
            this.form.setValue({
              sku: ''
            })
          }
        })
  }
  processOrder(order){
    this.orderService.processOrder(order.shortId).subscribe((responseData:any) => {
      console.log(responseData)
          if(responseData.ProcessedState == 'PROCESSED'){
            this.orderService.incrementProcessCount(order.shortId,responseData.OrderSummary.CustomerName);
            this.orderService.setReturnResponse(responseData,order.shortId);
            this.soundsService.playSuccess();  
            this.form.reset();
            this.orderField.nativeElement.focus();
          }
  
  
  
  
  
          else if(responseData.ProcessedState === 'NOT_PROCESSED'){
            
            console.log(responseData.Message)
              if(responseData.Message.indexOf('tracking number') !== -1){
                  const dialogRef = this.dialog.open(ModalComponent, {
                    width: '250px',
                    data: {orderId: responseData.OrderId,orderNumber: order.shortId, notHashedOrderId: order.shortId, form: this.form}
                  });
                  this.soundsService.playError(); 
                  dialogRef.afterClosed().subscribe(result => {   
          
                  });
      
        
                    
              }
            
              else{
                this.soundsService.playError(); 
                //this.orderService.setReturnResponse(responseData);
                
              }
          }
  
  
  
  
  
  
          else if(responseData.ProcessedState === 'NOT_FOUND'){
  
            this.orderService.searchProcessedOrders(order.shortId).subscribe((processedRes:any)=>{
              if(processedRes.ProcessedOrders.Data.length > 0){
                this.orderService.setReturnResponse(processedRes,order.shortId);
                this.soundsService.playError(); 
                this.form.reset();
              }
              else{
                this.orderService.setReturnResponse('NO DATA FOUND',order.shortId); 
                this.form.reset();
                this.soundsService.playError(); 
              }
            })
  
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
  
           
          }
        

       

        
    })
  }

}
