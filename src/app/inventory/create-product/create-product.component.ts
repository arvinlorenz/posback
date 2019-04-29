import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { InventoryService } from '../inventory.service';
import * as moment from 'moment-timezone';
import { SoundsService } from 'src/app/shared/sounds.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SuppliersCreateComponent } from 'src/app/inventory/suppliers/suppliers-create/suppliers-create.component';
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
  images: FormArray;
  suppliers;
  postalServices;
  categories;
  packageGroups;

  
  constructor(private _formBuilder: FormBuilder, 
              private inventoryService: InventoryService, 
              private soundService: SoundsService, 
              private router: Router,
              public dialog: MatDialog) { }
 //checkedSuppliers: any[] = []
  // toggleSuppliers({checked},b){
  //   if(checked){
  //     this.checkedSuppliers.push(b)
  //   }
  //   else{
  //       if(this.checkedSuppliers.indexOf(b) != -1){
  //         this.checkedSuppliers.splice(this.checkedSuppliers.indexOf(b),1)
  //       }
        
      
  //   }
  //   console.log(this.checkedSuppliers)
  // }
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
      this.secondFormGroup.controls['postalServiceId'].setValue("00000000-0000-0000-0000-000000000000");
    })
    this.inventoryService.getCategories()
    .subscribe(categories=>{
      this.categories = categories
      this.secondFormGroup.controls['categoryId'].setValue("00000000-0000-0000-0000-000000000000");
    })
    this.inventoryService.getPackageGroups()
    .subscribe(packageGroups=>{
      this.packageGroups = packageGroups
      this.secondFormGroup.controls['packageGroupId'].setValue("00000000-0000-0000-0000-000000000000");
    })

    this.firstFormGroup = this._formBuilder.group({
      itemNumber:['', Validators.required],
      itemTitle:'',
      quantity:'',
      bin:'',
      images: this._formBuilder.array([ this.createNewImage() ])
    });
    this.firstFormGroup.controls.itemNumber.disable();
    this.secondFormGroup = this._formBuilder.group({
      minimumLevel: '',
      barcodeNumber: '',
      purchasePrice: '',
      retailPrice: '',
      taxRate: '',
      postalServiceId: '',
      categoryId: '',
      packageGroupId: '',
      height: '',
      width: '',
      depth: '',
      weight: '',
      //image: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      suppliersSelected: [[], Validators.required]
    });

  }
  createNewImage(): FormGroup {
    return this._formBuilder.group({
      imageUrl: ''
    });
  }
  addImage(): void {
    this.images = this.firstFormGroup.get('images') as FormArray;
    this.images.push(this.createNewImage());
  }
  createSupplier(){
    const dialogRef = this.dialog.open(SuppliersCreateComponent, {
      width: '250px',
      data:{}
    });
    dialogRef.afterClosed().subscribe(newSupplier => {   
      if(newSupplier=== undefined){
        return
      }
      this.suppliers.push(newSupplier)
      
      this.thirdFormGroup.controls['suppliersSelected'].setValue([...this.thirdFormGroup.value.suppliersSelected, newSupplier.pkSupplierID]);
      
      
    });
  }
  addInventoryItem(){
    
    let images = this.firstFormGroup.value.images;

    if(this.firstFormGroup.invalid||this.secondFormGroup.invalid ){
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
      "Quantity": this.firstFormGroup.value.quantity || 0,
      "MinimumLevel": this.secondFormGroup.value.minimumLevel || 4,
      "CreationDate": now,
      "IsCompositeParent": true,
      "ItemNumber": this.firstFormGroup.value.itemNumber,
      "ItemTitle": this.firstFormGroup.value.itemTitle || 'new product',
      "BarcodeNumber": this.secondFormGroup.value.barcodeNumber || 0,
      "MetaData": "",
      "isBatchedStockType": false,
      "PurchasePrice": this.secondFormGroup.value.purchasePrice || 0,
      "RetailPrice": this.secondFormGroup.value.retailPrice || 0,
      "TaxRate": this.secondFormGroup.value.taxRate || 0,
      "PostalServiceId": this.secondFormGroup.value.postalServiceId,
      "PostalServiceName": postalServiceName,
      "CategoryId": this.secondFormGroup.value.categoryId,
      "CategoryName": categoryName,
      "PackageGroupId": this.secondFormGroup.value.packageGroupId,
      "PackageGroupName": packageGroupName,
      "Height": this.secondFormGroup.value.height || 0,
      "Width": this.secondFormGroup.value.width || 0,
      "Depth": this.secondFormGroup.value.depth || 0,
      "Weight": this.secondFormGroup.value.weight || 0,
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
      
      images.forEach(image=>{
        if(image.imageUrl != ''){
          this.inventoryService.uploadImageToLinn(image.imageUrl,stockItemId, this.firstFormGroup.value.itemNumber)
          .subscribe(a=>{
            console.log(a)
          })
        }
        
      })

      this.inventoryService.setBinRack(stockItemId,this.firstFormGroup.value.bin || 88)
      .subscribe(b=>{
        if(b != null){
          this.soundService.playError()
          return
        }
        this.soundService.playSuccess()
        this.router.navigate(['inventory',this.firstFormGroup.value.itemNumber]) 
      })

      let suppliers = [];
      this.thirdFormGroup.value.suppliersSelected.forEach(supplier=>{
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
