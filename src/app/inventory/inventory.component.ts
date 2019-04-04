import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import {  Router } from '@angular/router';
import { SoundsService } from '../shared/sounds.service';
import { startWith, map } from 'rxjs/operators';
import { TokenService } from '../shared/token.service';
import { MatAutocomplete } from '@angular/material';

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
  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    
    return this.SKUs.filter(sku => sku.toLowerCase().includes(filterValue));
  }
  constructor(private inventoryService: InventoryService, private router: Router, private soundsService: SoundsService, private tokenService: TokenService) { }

  ngOnInit() {

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

  chooseFirstOptionActive(event): void {
    if (event.key != "ArrowDown" && event.key != "ArrowUp" &&  event.keyCode != 8) {
      if(this.matAutocomplete.options.length > 0){
        this.matAutocomplete.options.first.setActiveStyles();
      } 
      
    }
    
    
  }
  // chooseFirstOptionActive(): void {
  //   this.matAutocomplete.options.first.setActiveStyles();
  //   this.matAutocomplete.options.first.select();
    
  // }

  ngAfterViewInit(){
    this.skuKeyField.nativeElement.focus();
  }



  checkSku(){
    
    this.form.setValue({
      skuKey:this.myControl.value
    });
    
    if(!this.SKUs.includes(this.myControl.value)){
      console.log('options',this.matAutocomplete.options.length)
      if(this.matAutocomplete.options.length > 0){
        this.myControl.setValue(this.matAutocomplete.options.first.value)
        this.form.setValue({
          skuKey:this.matAutocomplete.options.first.value
        });
      }    
    }
    if(this.form.invalid){
      this.form.reset();
      this.soundsService.playError(); 
      return;
    }
    
    
    this.router.navigate([this.router.url.split('/')[1], this.form.value.skuKey]);
  }


}
