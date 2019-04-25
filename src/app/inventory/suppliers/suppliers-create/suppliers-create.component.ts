import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../inventory.service';
import { SoundsService } from 'src/app/shared/sounds.service';

@Component({
  selector: 'app-suppliers-create',
  templateUrl: './suppliers-create.component.html',
  styleUrls: ['./suppliers-create.component.css']
})
export class SuppliersCreateComponent implements OnInit {
  supplierFormGroup: FormGroup

  constructor(
    public dialogRef: MatDialogRef<SuppliersCreateComponent>, 
    @Inject(MAT_DIALOG_DATA) public data, 
    private _formBuilder: FormBuilder,
    private inventoryService:InventoryService,
    private soundService: SoundsService) { }

  ngOnInit() {
    this.supplierFormGroup = this._formBuilder.group({
      supplierName:['', Validators.required],
      contactName:['', Validators.required],
      address:['', Validators.required],
      cityTown:['', Validators.required],
      region:['', Validators.required],
      country:['', Validators.required],
      postCode:['', Validators.required],
      contact:['', Validators.required],
      email:['', Validators.required],
    

    });
  }

  closeDialog(responseData) {
    this.dialogRef.close(responseData);
  }

  createSupplier(){
    if(this.supplierFormGroup.invalid ){
      this.soundService.playError()
      return
    }
    let supplier = {  
      "SupplierName": this.supplierFormGroup.value.supplierName,
      "ContactName":this.supplierFormGroup.value.contactName,
      "Email":this.supplierFormGroup.value.email,
      "Address":this.supplierFormGroup.value.address,
      "AlternativeAddress":"",
      "City":this.supplierFormGroup.value.cityTown,
      "Region":this.supplierFormGroup.value.region,
      "Country":this.supplierFormGroup.value.country,
      "PostCode":this.supplierFormGroup.value.postCode,
      "TelephoneNumber":this.supplierFormGroup.value.contact,
      "SecondaryTelNumber":"",
      "FaxNumber":"",
      "WebPage":"",
      "Currency":"AUD"
   }

   this.inventoryService.addSupplier(supplier)
    .subscribe(a=>{
      this.dialogRef.close(a);
    })
  }

}
