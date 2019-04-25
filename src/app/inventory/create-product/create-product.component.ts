import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { InventoryService } from '../inventory.service';
import * as moment from 'moment-timezone';
import { SoundsService } from 'src/app/shared/sounds.service';
import { Router } from '@angular/router';
//import { read } from 'fs';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  suppliers;
  postalServices;
  categories;
  packageGroups;

  checkedSuppliers: any[] = []
  constructor(private _formBuilder: FormBuilder, private inventoryService: InventoryService, private soundService: SoundsService, private router: Router) { }
 
  toggleSuppliers({checked},b){
    if(checked){
      this.checkedSuppliers.push(b)
    }
    else{
        if(this.checkedSuppliers.indexOf(b) != -1){
          this.checkedSuppliers.splice(this.checkedSuppliers.indexOf(b),1)
        }
        
      
    }
    console.log(this.checkedSuppliers)
  }
  ngOnInit() {
    
    
    this.inventoryService.getNewItemNumber().subscribe(newItemNumber=>{
      this.firstFormGroup.controls['itemNumber'].setValue(newItemNumber);
      this.firstFormGroup.controls.itemNumber.enable();
    })

    this.inventoryService.getAllSuppliers()
    .subscribe(suppliers=>{
      this.suppliers = suppliers
      console.log(suppliers)
    })

    this.inventoryService.getPostalServices()
    .subscribe(postalServices=>{
      this.postalServices = postalServices
    })
    this.inventoryService.getCategories()
    .subscribe(categories=>{
      this.categories = categories
    })
    this.inventoryService.getPackageGroups()
    .subscribe(packageGroups=>{
      this.packageGroups = packageGroups
    })

    this.firstFormGroup = this._formBuilder.group({
      itemNumber:['', Validators.required],
      itemTitle:['', Validators.required],
      quantity:['', Validators.required],
      openOrder:['', Validators.required],
      available:['', Validators.required],
      due:['', Validators.required],
      image:[''],
      //wala sa api
      bin:['', Validators.required],

    });
    this.firstFormGroup.controls.itemNumber.disable();
    this.secondFormGroup = this._formBuilder.group({
      //wala sa api
     

     

      minimumLevel: ['', Validators.required],
      barcodeNumber: ['', Validators.required],
      purchasePrice: ['', Validators.required],
      retailPrice: ['', Validators.required],
      taxRate: ['', Validators.required],
      postalServiceId: ['', Validators.required],
      categoryId: ['', Validators.required],
      packageGroupId: ['', Validators.required],
      height: ['', Validators.required],
      width: ['', Validators.required],
      depth: ['', Validators.required],
      weight: ['', Validators.required],
      //image: ['', Validators.required]
      
    });

    // this.thirdFormGroup = this._formBuilder.group({
    //   supplier: ['', Validators.required],
    //   code: ['', Validators.required],
    //  //2 barCode: ['', Validators.required],
    //   leadTime: ['', Validators.required],
    //   purchasePrice: ['', Validators.required],
    //   purchasePriceAUD: ['', Validators.required],
    //   minPrice: ['', Validators.required],
    //   maxPrice: ['', Validators.required],
    //   averagePrice: ['', Validators.required],
    //   averageLeadTime: ['', Validators.required],
    //   supplierMinOrderQty: ['', Validators.required],
    //   supplierPackSize: ['', Validators.required],
    //   supplierCurrency: ['', Validators.required],  
    // });
  }
  
  addInventoryItem(){
    // this.inventoryService.uploadImageOfInvToLinn(this.firstFormGroup.value.image)
    //   .subscribe(a=>{
    //     console.log(a)
    //   })
    if(this.firstFormGroup.invalid||this.secondFormGroup.invalid ){
      console.log(this.firstFormGroup.invalid, this.secondFormGroup.invalid)
      this.soundService.playError()
      return
    }
    class Guid {
      static newGuid() {
          return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
              return v.toString(16);
          });
      }
    }
    let now = moment(Date.now()).tz('Australia/Sydney').add(1, 'hours').format()
 
    let stockItemId = Guid.newGuid();
    let postalServiceName = this.postalServices.find(name=> name.Value === this.secondFormGroup.value.postalServiceId).Key
    let categoryName = this.categories.find(name=> name.CategoryId === this.secondFormGroup.value.categoryId).CategoryName
    let packageGroupName = this.packageGroups.find(name=> name.Value === this.secondFormGroup.value.packageGroupId).Key

    
    let inventoryItem={
      "Quantity": this.firstFormGroup.value.quantity,
      "InOrder": this.firstFormGroup.value.openOrder,
      "Due": this.firstFormGroup.value.due,
      "MinimumLevel": this.secondFormGroup.value.minimumLevel,
      "Available": this.firstFormGroup.value.available,
      "CreationDate": now,
      "IsCompositeParent": true,
      "ItemNumber": this.firstFormGroup.value.itemNumber,
      "ItemTitle": this.firstFormGroup.value.itemTitle,
      "BarcodeNumber": this.secondFormGroup.value.barcodeNumber,
      "MetaData": "",
      "isBatchedStockType": false,
      "PurchasePrice": this.secondFormGroup.value.purchasePrice,
      "RetailPrice": this.secondFormGroup.value.retailPrice,
      "TaxRate": this.secondFormGroup.value.taxRate,
      "PostalServiceId": this.secondFormGroup.value.postalServiceId,
      "PostalServiceName": postalServiceName,
      "CategoryId": this.secondFormGroup.value.categoryId,
      "CategoryName": categoryName,
      "PackageGroupId": this.secondFormGroup.value.packageGroupId,
      "PackageGroupName": packageGroupName,
      "Height": this.secondFormGroup.value.height,
      "Width": this.secondFormGroup.value.width,
      "Depth": this.secondFormGroup.value.depth,
      "Weight": this.secondFormGroup.value.weight,
      "InventoryTrackingType": 21,
      "BatchNumberScanRequired": true,
      "SerialNumberScanRequired": true,
      "StockItemId": stockItemId
    }
    console.log(inventoryItem)
    this.inventoryService.addInventoryItem(inventoryItem)
    .subscribe(a=>{
      if(a != null){
        this.soundService.playError()
        return
      }
      this.soundService.playSuccess()
      this.router.navigate(['inventory',this.firstFormGroup.value.itemNumber])
      
      this.inventoryService.setBinRack(stockItemId,this.firstFormGroup.value.bin)
      .subscribe(b=>{
        if(b != null){
          this.soundService.playError()
          return
        }
        this.soundService.playSuccess()
        this.router.navigate(['inventory',this.firstFormGroup.value.itemNumber]) 
      })

      let suppliers = [];
      this.checkedSuppliers.forEach(supplier=>{
        suppliers.push({
          StockItemId: stockItemId,
          Supplier: this.suppliers.find(sup=> sup.pkSupplierID == supplier).SupplierName,
          SupplierID: supplier,
          "IsDefault":true,
          "Code":this.secondFormGroup.value.itemNumber,
          "SupplierBarcode":"",
          "LeadTime":1,
          "PurchasePrice": this.secondFormGroup.value.purchasePrice,
          "SupplierCurrency":"AUD",
          "SupplierMinOrderQty":0,
          "SupplierPackSize":0,
          "isAdded":true
         })
      })

      this.inventoryService.addSuppliersToNewCreatedInventory(suppliers)
        .subscribe(b=>{
          if(b != null){
            this.soundService.playError()
            return
          }
          this.soundService.playSuccess()
          this.router.navigate(['inventory',this.firstFormGroup.value.itemNumber])
        })
      
        

      
    })
  }

  // onImagePicked(event: Event){
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.firstFormGroup.patchValue({image: file});
  //   this.firstFormGroup.get('image').updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = ()=>{
  //     //this.imagePreview = reader.result;
  //     console.log(reader.result)
  //   };
  //   reader.readAsDataURL(file);
  // }

}
