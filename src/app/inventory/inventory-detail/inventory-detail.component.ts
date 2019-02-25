import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryService } from '../inventory.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'src/app/shared/token.service';
import { SoundsService } from 'src/app/shared/sounds.service';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css']
})
export class InventoryDetailComponent implements OnInit, OnDestroy{
  itemDetails;
  skuDetails;
  skuDetailsSub: Subscription;
  itemStockId;
  imagePath = null;
  editMode = false;
  showButton = false;
  itemId;
  skuform: FormGroup;
  @ViewChild("quantity") quantityField: ElementRef;
  constructor(
      public inventoryService: InventoryService, 
      public tokenService: TokenService, 
      public soundsService: SoundsService,
      public route: ActivatedRoute) { }

  disableAllFields(){
    this.skuform.controls.itemNumber.disable();
    this.skuform.controls.itemTitle.disable();
    this.skuform.controls.quantity.disable();
    this.skuform.controls.openOrder.disable();
    this.skuform.controls.available.disable();
    this.skuform.controls.due.disable();
    this.skuform.controls.bin.disable();
  }
  skuSubscribe(){
    this.inventoryService.getSkuDetails(this.itemId).subscribe((resSku:any[])=>{
                
      if(resSku.length === 0){
        this.soundsService.playError();
        this.skuform.reset();
        this.showButton = false;
        this.imagePath = null;
        this.disableAllFields();
        return;
      }
      else{
        console.log(resSku[0]);
        this.showButton = true;
        this.itemDetails = {
          itemNumber: resSku[0].ItemNumber,
          itemTitle: resSku[0].ItemTitle,
          available: resSku[0].Available,
          quantity: resSku[0].Quantity,
          openOrder:resSku[0].InOrder,
          due: resSku[0].Due,
          bin: ''
        }
        this.inventoryService.setSkuDetails({...this.skuDetails,...this.itemDetails});

        this.itemStockId = resSku[0].StockItemId;
        
        this.inventoryService.getItemImage(this.itemStockId)
          .subscribe((img:any[])=>{
            if(img.length > 0){
              this.itemDetails.imagePath = img[0].FullSource;
              this.imagePath = this.itemDetails.imagePath;
              this.inventoryService.setSkuDetails({...this.skuDetails,...this.itemDetails});
            }
            else{
              this.itemDetails.imagePath = null;
              this.imagePath = this.itemDetails.imagePath;
              this.inventoryService.setSkuDetails({...this.skuDetails,...this.itemDetails});
            }
          })
        this.inventoryService.getBinRackDetail(resSku[0].StockItemId)
          .subscribe((resBin: any[]) =>{
            if(resBin.length === 0){
              this.inventoryService.setSkuDetails(this.itemDetails);
              this.skuform = new FormGroup({
                itemNumber: new FormControl(this.skuDetails.itemNumber, Validators.required),
                itemTitle: new FormControl(this.skuDetails.itemTitle, Validators.required),
                quantity: new FormControl(this.skuDetails.quantity, Validators.required),
                openOrder: new FormControl(this.skuDetails.openOrder, Validators.required),
                available: new FormControl(this.skuDetails.available, Validators.required),
                due: new FormControl(this.skuDetails.due, Validators.required),
                bin: new FormControl('-', Validators.required)
              });
              this.disableAllFields();
            }
            else{
              this.itemDetails.bin = resBin[0].BinRack;
              this.inventoryService.setSkuDetails({...this.skuDetails,...this.itemDetails});
              this.skuform = new FormGroup({
                itemNumber: new FormControl(this.skuDetails.itemNumber, Validators.required),
                itemTitle: new FormControl(this.skuDetails.itemTitle, Validators.required),
                quantity: new FormControl(this.skuDetails.quantity, Validators.required),
                openOrder: new FormControl(this.skuDetails.openOrder, Validators.required),
                available: new FormControl(this.skuDetails.available, Validators.required),
                due: new FormControl(this.skuDetails.due, Validators.required),
                bin: new FormControl(this.skuDetails.bin, Validators.required)
              });
              this.disableAllFields();
            }
              
          }); 
      }
    
    });
  }
  ngOnInit() {

    this.skuDetailsSub = this.inventoryService.getSkuDetailsUpdateListener()
      .subscribe((skuRes)=>{
        console.log('h')
        this.skuDetails = skuRes;
        this.skuform.setValue({
          itemNumber: this.skuDetails.itemNumber,
          itemTitle: this.skuDetails.itemTitle,
          quantity: this.skuDetails.quantity,
          openOrder: this.skuDetails.openOrder,
          available: this.skuDetails.available,
          due: this.skuDetails.due,
          bin: this.skuDetails.bin        
        });
      });

    this.skuform = new FormGroup({
      itemNumber: new FormControl(null, Validators.required),
      itemTitle: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      openOrder: new FormControl(null, Validators.required),
      available: new FormControl(null, Validators.required),
      due: new FormControl(null, Validators.required),
      bin: new FormControl(null, Validators.required)
    });
    this.disableAllFields();
      
    this.route.paramMap
        .subscribe(
        (paramMap: ParamMap)=>{
            
          if(paramMap.has('itemId')){
            this.itemId = paramMap.get('itemId');
            this.editMode = false;
            if(this.tokenService.getToken() === undefined)
            {
              this.tokenService.tokenUpdateListener().subscribe(a=>{
                this.skuSubscribe();
              })
            }
            else{
              this.skuSubscribe();
            }
              
          }
        }    
        ); 
        
  }

  edit(){
    this.editMode = true;
    this.skuform.controls.quantity.enable();
    this.skuform.controls.bin.enable();
    this.quantityField.nativeElement.focus();
   
  }
  cancel(){
    this.editMode = false;
    this.disableAllFields();
  }

  save(){
    console.log('hi')
    let newQuantity = this.skuform.value.quantity;
    let available;
    this.inventoryService.setQuantity(this.itemId,newQuantity)
      .subscribe(a =>{
        available = a[0].Available;
        this.inventoryService.setBinRack(this.itemStockId, this.skuform.value.bin)
          .subscribe((a:any)=>{
            
            if(a===null){
              this.inventoryService.setSkuDetails({...this.skuDetails, available ,quantity: newQuantity, bin:this.skuform.value.bin})
              this.disableAllFields();
              this.editMode = false;
              this.soundsService.playSuccess();
            }
          
        })
        
      })
  }
  ngOnDestroy(){
    this.skuDetailsSub.unsubscribe();
  }

}