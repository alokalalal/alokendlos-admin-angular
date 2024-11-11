import { ListContainerFilter } from '../../../Interface/list-container-filter';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'list-container-filter[buttonArray]',
  templateUrl: './list-container-filter.component.html',
  styleUrls: ['./list-container-filter.component.css']
})
export class ListContainerFilterComponent implements OnInit {

  @Input() buttonArray : Array<ListContainerFilter> = [];
  @Output() filter = new EventEmitter();
  dropdownFilterControl: any;
  constructor() { }

  ngOnInit(): void {
  }

  filterData(data : ListContainerFilter){
    this.buttonArray.forEach(e => {
      e.isSelected = false;
      if(e.value == data.value){
        e.isSelected = true;
      }
    })
    this.filter.emit(data);
  }

}
