import { Component, OnInit, OnDestroy} from '@angular/core';
import { OrderService } from '../order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-open-order',
  templateUrl: './open-order.component.html',
  styleUrls: ['./open-order.component.css']
})
export class OpenOrderComponent implements OnInit, OnDestroy {
  orders;
  ordersSub: Subscription;


  countries;
  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getOpenOrdersWithEdit();
    this.ordersSub = this.orderService.openOrdersUpdatedListener()
      .subscribe(orders=>{
        this.orders = orders;
      })
    this.orderService.getCountries()
      .subscribe(countries=>{
        this.countries = countries;
      })
  }

  ngOnDestroy(){
    this.ordersSub.unsubscribe();
  }

  changeValue(id: number, property: string, event: any) {

  }


  updateList(id:number, orderId: number, property: string, event: any) {
    let fieldAndValue;

   if(property === 'CountryId'){
     console.log(event.target.value)
    this.orders[id]['CountryId'] = event.target.value;
    let CountryName = this.countries.filter((country:any) =>{
      if (country.CountryId === event.target.value){
        return country
      }
    });
    this.orders[id]['Country'] = CountryName[0].CountryName;
    CountryName = CountryName[0].CountryName;
    fieldAndValue = {
      Country: CountryName,
      CountryId: event.target.value
    }
   }
   else{
    this.orders[id][property] = event.target.textContent;
    fieldAndValue = {
      property: event.target.value
    }
   }
    

    
    
    this.orderService.updateOpenOrder(orderId, fieldAndValue, this.orders[id])
      
   
  }

}
