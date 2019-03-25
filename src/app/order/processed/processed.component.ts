import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-processed',
  templateUrl: './processed.component.html',
  styleUrls: ['./processed.component.css']
})
export class ProcessedComponent implements OnInit {
  @Input() orders;
  constructor() { }

  ngOnInit() {
  }

}
