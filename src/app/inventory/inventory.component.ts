import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import {  Router } from '@angular/router';
import { SoundsService } from '../shared/sounds.service';
import { startWith, map } from 'rxjs/operators';
import { TokenService } from '../shared/token.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, AfterViewInit {
  form;
  skuDetails;
  myControl = new FormControl();
  SKUs:string[] = [];
  skuDetailsSub: Subscription;
  filteredOptions: Observable<string[]>;
  @ViewChild("skuKey") skuKeyField: ElementRef;
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.SKUs.filter(sku => sku.toLowerCase().includes(filterValue));
  }
  constructor(private inventoryService: InventoryService, private router: Router, private soundsService: SoundsService, private tokenService: TokenService) { }

  ngOnInit() {
    localStorage.setItem('linnToken'," this.token");

     this.tokenService.tokenUpdateListener()
      .subscribe(res=>{
        this.inventoryService.getInventoryItems()
        .subscribe((inventories:any)=>{
          this.SKUs = inventories.Items.map(inventory=>{
            return inventory.SKU
            
          })
          console.log(this.SKUs)
          
        })
      })


    this.form = new FormGroup({
      skuKey: new FormControl(null, {
        validators: [Validators.required]
      })
    });


    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      
    this.inventoryService.getInventoryItems()
      .subscribe((inventories:any)=>{
        this.SKUs = inventories.Items.map(inventory=>{
          return inventory.SKU
          
        })
        console.log(this.SKUs)
        
      })
    

  }

  ngAfterViewInit(){
    this.skuKeyField.nativeElement.focus();
  }



  checkSku(){
    
    this.form.setValue({
      skuKey:this.myControl.value
    });
    if(this.form.invalid){
      this.form.reset();
      this.soundsService.playError(); 
      return;
    }
    
    
    this.router.navigate([this.router.url.split('/')[1], this.form.value.skuKey]);
  }


}
