import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InventoryService } from './inventory.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {  Router } from '@angular/router';
import { SoundsService } from '../shared/sounds.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  form;
  skuDetails;
  skuDetailsSub: Subscription;
  @ViewChild("skuKey") skuKeyField: ElementRef;
  constructor(private inventoryService: InventoryService, private router: Router, private soundsService: SoundsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      skuKey: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.skuKeyField.nativeElement.focus();

    

  }

  checkSku(){
    if(this.form.invalid){
      this.form.reset();
      this.soundsService.playError(); 
      return;
    }
  
    this.router.navigate([this.router.url.split('/')[1], this.form.value.skuKey]);
   
  }


}
