import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order/order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OthersService } from '../shared/others.service';

@Component({
  selector: 'app-printlabel-processorder',
  templateUrl: './printlabel-processorder.component.html',
  styleUrls: ['./printlabel-processorder.component.css']
})
export class PrintlabelProcessorderComponent implements OnInit {
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
  constructor(private orderService: OrderService, private otherService: OthersService) { }

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
        let uniqueTems = [];
        this.templates = templates.filter(template=>{
          if(!uniqueTems.includes(template.TemplateType)){
            uniqueTems.push(template.TemplateType);
            return template;
          } 
        });
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
          console.log('pid',this.packagingTypeSelected)
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
    }
  }

  // printLabel(){
  //   this.orderService.createPDF(IDs, printer,printerLocation, templateId, templateType)
  //       .subscribe((a:any)=>{
  //         console.log(a)
  //         if(a.KeyedError.length == 0){
  //           alert('Printing...')
  //           this.soundService.playSuccess();
  //           this.form.setValue({
  //             sku: ''
  //           })
  //           this.skuField.nativeElement.focus();
  //         }
  //         else{
  //           this.soundService.playError();
  //           this.form.setValue({
  //             sku: ''
  //           })
  //           this.skuField.nativeElement.focus();
  //         }
  //       })
  // }

}
