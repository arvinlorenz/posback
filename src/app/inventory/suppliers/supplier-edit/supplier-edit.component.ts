import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { Subscription } from 'rxjs';
import { SoundsService } from 'src/app/shared/sounds.service';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit, OnDestroy {
  index;
  supplier;
  form;
  edittingSupplierSub: Subscription;
  supplierId;
  itemStockId;

  showButton = false;
  editMode = false;;
  constructor(private inventoryService: InventoryService, private soundsService: SoundsService) { }

  disableAllFields(){
    this.form.controls.supplier.disable();
    this.form.controls.code.disable();
    this.form.controls.barCode.disable();
    this.form.controls.leadTime.disable();
    this.form.controls.purchasePrice.disable();
    this.form.controls.minPrice.disable();
    this.form.controls.maxPrice.disable();
    this.form.controls.averagePrice.disable();
    this.form.controls.averageLeadTime.disable();
    this.form.controls.supplierMinOrderQty.disable();
    this.form.controls.supplierPackSize.disable();
    this.form.controls.supplierCurrency.disable();
  }
  enableAllFields(){
    this.form.controls.supplier.enable();
    this.form.controls.code.enable();
    this.form.controls.barCode.enable();
    this.form.controls.leadTime.enable();
    this.form.controls.purchasePrice.enable();
    this.form.controls.minPrice.enable();
    this.form.controls.maxPrice.enable();
    this.form.controls.averagePrice.enable();
    this.form.controls.averageLeadTime.enable();
    this.form.controls.supplierMinOrderQty.enable();
    this.form.controls.supplierPackSize.enable();
    this.form.controls.supplierCurrency.enable();
  }
  
  ngOnInit() {
     this.form = new FormGroup({
      supplier: new FormControl(null, Validators.required),
      code: new FormControl(null, Validators.required),
      barCode: new FormControl(null, Validators.required),
      leadTime: new FormControl(null, Validators.required),
      purchasePrice: new FormControl(null, Validators.required),
      minPrice: new FormControl(null, Validators.required),
      maxPrice: new FormControl(null, Validators.required),
      averagePrice: new FormControl(null, Validators.required),
      averageLeadTime: new FormControl(null, Validators.required),
      supplierMinOrderQty: new FormControl(null, Validators.required),
      supplierPackSize: new FormControl(null, Validators.required),
      supplierCurrency: new FormControl(null, Validators.required),  
    });
    this.disableAllFields();

   

    this.edittingSupplierSub = this.inventoryService.editSupplierListener()
      .subscribe(res=>{
        this.index = res.index;
        this.showButton = true;
        this.itemStockId = res.itemStockId;
        this.supplier = this.inventoryService.getSupplierByIndex(this.index);
        this.supplierId = this.supplier.SupplierID;
        
        this.form.setValue({
          supplier: this.supplier.Supplier,
          code: this.supplier.Code,
          barCode: this.supplier.SupplierBarcode,
          leadTime: this.supplier.LeadTime,
          purchasePrice: this.supplier.PurchasePrice,
          minPrice: this.supplier.MinPrice,
          maxPrice: this.supplier.MaxPrice,
          averagePrice: this.supplier.AveragePrice,
          averageLeadTime: this.supplier.AverageLeadTime,
          supplierMinOrderQty: this.supplier.SupplierMinOrderQty,
          supplierPackSize: this.supplier.SupplierPackSize,
          supplierCurrency: this.supplier.SupplierCurrency,
        });
      })
  }
  save(){
    
    let data = {
      supplier: this.form.value.supplier,
      code: this.form.value.code,
      barCode: this.form.value.barCode,
      leadTime: this.form.value.leadTime,
      purchasePrice: this.form.value.purchasePrice,
      minPrice: this.form.value.minPrice,
      maxPrice: this.form.value.maxPrice,
      averagePrice: this.form.value.averagePrice,
      averageLeadTime: this.form.value.averageLeadTime,
      supplierMinOrderQty: this.form.value.supplierMinOrderQty,
      supplierPackSize: this.form.value.supplierPackSize,
      supplierCurrency: this.form.value.supplierCurrency,
    }
      
      
    
    this.inventoryService.updateSupplierStat(data,this.supplierId,this.itemStockId)
      .subscribe(a=>{
      
        if(a===null){
      
            this.inventoryService.getSuppliers(this.itemStockId).subscribe(suppliersRes=>{
              this.inventoryService.setSuppliers(suppliersRes);
              let supplierRecheck = this.inventoryService.getSupplierByIndex(this.index);
              console.log(supplierRecheck)
              this.form.setValue({
                supplier: supplierRecheck.Supplier,
                code: supplierRecheck.Code,
                barCode: supplierRecheck.SupplierBarcode,
                leadTime: supplierRecheck.LeadTime,
                purchasePrice: supplierRecheck.PurchasePrice,
                minPrice: supplierRecheck.MinPrice,
                maxPrice: supplierRecheck.MaxPrice,
                averagePrice: supplierRecheck.AveragePrice,
                averageLeadTime: supplierRecheck.AverageLeadTime,
                supplierMinOrderQty: supplierRecheck.SupplierMinOrderQty,
                supplierPackSize: supplierRecheck.SupplierPackSize,
                supplierCurrency: supplierRecheck.SupplierCurrency,
              });
              this.soundsService.playSuccess();
              this.editMode = false;
              this.disableAllFields();
            })
           
     
        }
      })
  }
  edit(){
    this.editMode = true;
    this.enableAllFields();
    //this.quantityField.nativeElement.focus();
   
  }
  cancel(){
    this.editMode = false;
    this.disableAllFields();
  }


  ngOnDestroy(){
    this.edittingSupplierSub.unsubscribe();
  }
}


