import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import { OrderService } from '../order.service';
import { Subscription, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenService } from 'src/app/shared/token.service';
import { SoundsService } from 'src/app/shared/sounds.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-open-order',
  templateUrl: './open-order.component.html',
  styleUrls: ['./open-order.component.css']
})
export class OpenOrderComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  orders;
  copyOrders;
  ordersSub: Subscription;

  loading = false;
  countries;
  dtOptions = {};
  totalRevenue = 0;
  dtTrigger: Subject<any> = new Subject();
  constructor(private orderService: OrderService, private tokenService: TokenService, private soundsService: SoundsService, public dialog: MatDialog) { }
  
  ngOnInit() {
    console.log('loaded')
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      order: [[ 0, 'desc' ]],
      "dom": '<"top"i>frt<"bottom"lp><"clear">',
      processing: true,
      "paging": true,
     
      responsive: {
        details: {
          //@ts-ignore
          renderer: $.fn.DataTable.Responsive.renderer.listHiddenNodes()
        }
      }

      
    };
    

    //this.orderService.getOpenOrdersWithEdit();
    
    this.loading = false;
    this.orders= this.orderService.getOpenOrders();
    this.totalRevenue = this.orders.reduce((a, current)=>{
      return a + current.Revenue
    }, 0)
    this.copyOrders = {...this.orders};
    $('#table').DataTable().destroy()
    this.dtTrigger.next();
    this.ordersSub = this.orderService.openOrdersUpdatedListener()
      .subscribe(orders=>{
        this.totalRevenue = orders.reduce((a, current)=>{
          return a + current.Revenue
        }, 0)
        console.log(this.totalRevenue)
        this.loading = false;
        this.orders = orders;
        this.copyOrders = {...orders};
        $('#table').DataTable().destroy()
        this.dtTrigger.next();
      })
    this.orderService.getCountries()
      .subscribe(countries=>{
        this.countries = countries;
      })

    // this.tokenService.tokenUpdateListener().subscribe(a=>{ 
    //   this.orderService.getOpenOrdersWithEdit();
    // })
  }
  //ngAfterViewInit(): void {this.dtTrigger.next();}
  ngOnDestroy(){
    this.ordersSub.unsubscribe();
   
    this.dtTrigger.unsubscribe();
    
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

  fetchOpenOrders(){
    this.loading = true;
     //this.orderService.fetchOpenOrders() this is with fetch data from linnworks and save to mongo

     this.orderService.getOpenOrdersWithEdit();
    
  }

  processOrder(order){
    this.orderService.processOrder(order.NumOrderId).subscribe((responseData:any) => {
      console.log(responseData)
          if(responseData.ProcessedState == 'PROCESSED'){
            this.orderService.incrementProcessCount(order.NumOrderId,responseData.OrderSummary.CustomerName);
            this.orderService.setReturnResponse(responseData,order.NumOrderId);
            this.soundsService.playSuccess();  
    
  
          }
  
  
  
  
  
          else if(responseData.ProcessedState === 'NOT_PROCESSED'){
            
            console.log(responseData.Message)
              if(responseData.Message.indexOf('tracking number') !== -1){
                  const dialogRef = this.dialog.open(ModalComponent, {
                    width: '250px',
                    data: {orderId: responseData.OrderId,orderNumber: order.NumOrderId, notHashedOrderId: order.NumOrderId}
                  });
                  this.soundsService.playError(); 
                  dialogRef.afterClosed().subscribe(result => {   
          
                  });
      
        
                    
              }
            
              else{
                this.soundsService.playError(); 
                //this.orderService.setReturnResponse(responseData);
                
              }
          }
  
  
  
  
  
  
          else if(responseData.ProcessedState === 'NOT_FOUND'){
  
            this.orderService.searchProcessedOrders(order.NumOrderId).subscribe((processedRes:any)=>{
              if(processedRes.ProcessedOrders.Data.length > 0){
                this.orderService.setReturnResponse(processedRes,order.NumOrderId);
                this.soundsService.playError(); 
        
              }
              else{
                this.orderService.setReturnResponse('NO DATA FOUND',order.NumOrderId); 
        
                this.soundsService.playError(); 
              }
            })
  
          }
  
  
  
          // else if(responseData.Message === 'Invalid applicationId or applicationsecret.'){
          //   this.tokenService.getNewToken();
          //   this.tokenService.tokenUpdateListener()
          //     .subscribe(a=>{
          //       this.processOrder();
          //     })
          // }
  
          
          else{
            this.soundsService.playError(); 
  
           
          }
        

       

        
    })
  }

}
