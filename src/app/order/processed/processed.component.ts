import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../order.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-processed',
  templateUrl: './processed.component.html',
  styleUrls: ['./processed.component.css']
})

export class ProcessedComponent implements OnInit {
  @Input() orders;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor() { }

  ngOnInit() {
    this.dtTrigger.next();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      order: [[ 0, 'desc' ]],
      "dom": '<"top"i>frt<"bottom"lp><"clear">',
      processing: true,
    };
    
  }

}
