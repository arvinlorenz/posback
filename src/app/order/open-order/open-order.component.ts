import { Component, OnInit, OnDestroy} from '@angular/core';
import { OrderService } from '../order.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-open-order',
  templateUrl: './open-order.component.html',
  styleUrls: ['./open-order.component.css']
})
export class OpenOrderComponent implements OnInit, OnDestroy {
  orders;
  copyOrders;
  ordersSub: Subscription;


  countries;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private orderService: OrderService) { }

  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[ 0, 'asc' ]],
      "dom": '<"top"i>frt<"bottom"lp><"clear">',
      processing: true,
      //responsive: true
      
    };

    this.orderService.getOpenOrdersWithEdit();
    this.ordersSub = this.orderService.openOrdersUpdatedListener()
      .subscribe(orders=>{
        this.orders = orders;
        this.copyOrders = {...orders};
        this.dtTrigger.next();
      })
    this.orderService.getCountries()
      .subscribe(countries=>{
        this.countries = countries;
      })
  }

  ngOnDestroy(){
    this.ordersSub.unsubscribe();
   
    this.dtTrigger.unsubscribe();
    
  }

  changeValue(id: number, property: string, event: any) {

  }


  updateList(id:number, orderId: number, property: string, event: any) {
    
  let fieldAndValue;

   if(property === 'CountryId'){
    let CountryName = this.countries.filter((country:any) =>{
      if (country.CountryId === event.target.value){
        return country
      }
    });
    //this.copyOrders[id]['Country'] = CountryName[0].CountryName;
    CountryName = CountryName[0].CountryName;
    fieldAndValue = {
      Country: CountryName,
      CountryId: event.target.value
    }
    this.copyOrders[id] = {
      ...this.copyOrders[id],
      ...fieldAndValue,
    }

   }
   else{
    //this.copyOrders[id][property] = event.target.textContent
    fieldAndValue = {
      [property]: event.target.textContent
    }
    this.copyOrders[id] = {
      ...this.copyOrders[id],
      ...fieldAndValue,
    }
   }
  


    
    
    this.orderService.updateOpenOrder(orderId, fieldAndValue, this.copyOrders[id])
      
   
  }

}
