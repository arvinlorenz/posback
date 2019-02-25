import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  @Input() suppliers;
  @Input() itemStockId;

  constructor(private inventoryService: InventoryService) {
   }

  ngOnInit() {
  }
  onEditSupplier(i){
    this.inventoryService.editSupplier.next({index: i, itemStockId: this.itemStockId});
  }
}
