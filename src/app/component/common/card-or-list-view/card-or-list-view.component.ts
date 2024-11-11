import { Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { AdvanceSearchFilterConfig, ListContainer } from './../../../Interface/list-container';
import { View } from './../../../view/common/view';
import { CardItemDirective } from './directive/card-item.directive';
import { ListItemDirective } from './directive/list-item.directive';
import { ListOrderComponent } from './list-order/list-order.component';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
    selector: 'card-or-list-view[listContainer]',
    templateUrl: './card-or-list-view.component.html',
    styleUrls: ['./card-or-list-view.component.scss']
})
export class CardOrListViewComponent<V extends View> implements OnChanges {
    @ViewChild("listOrderComponent") listOrderComponent!: ListOrderComponent;
    @ContentChild(CardItemDirective, { read: TemplateRef }) cardItemTemplate: any;
    @ContentChild(ListItemDirective, { read: TemplateRef }) listItemTemplate: any;

    @Input() start!: number;
    @Input() pageSize!: number;
    @Input() recordSize!: number;
    @Input() listContainer!: ListContainer;
    @Output() searchEventEmitter = new EventEmitter();
    @Output() addEventEmitter = new EventEmitter();
    @Output() addExport = new EventEmitter();
    @Output() selectedObject!: any;

    public selectedOrderType!: KeyValueView;
    public selectedOrderParam!: KeyValueView;

    public hasAdvanceFilter: boolean = false
    public isFilterApplied: boolean = false
    private _items: Array<V> = [];
    public isNoDataFound: boolean = false;
    public defaultEndDate = new Date();
    startDate:any;
    endDate:any;
    searchBody = Object();
    hasDisplayExportButton:any;


    public get items(): Array<V> {
        return this._items;
    }

    public addItem(value: V) {
        this.items.push(value);
        if (this.items.length == 0) {
            this.isNoDataFound = true;
        } else {
            this.isNoDataFound = false;
        }
    }
    public set items(value: Array<V>) {
        if (Array.isArray(value)) {
            this._items = value;
        }
        if (this.items.length == 0) {
            this.isNoDataFound = true;
        } else {
            this.isNoDataFound = false;
        }
    }

    constructor(private eventEmitterService: EventEmitterService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.listContainer.listOrderConfig && this.selectedOrderParam == undefined && this.selectedOrderType == undefined) {
            this.selectedOrderParam = this.listContainer.listOrderConfig.defaultSelectedParameter;
            this.selectedOrderType = this.listContainer.listOrderConfig.defaultSelectedOrderType;
        }
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.type != "fullTextSearch") {
                this.hasAdvanceFilter = true;
            }
        });
    }

    filterData(filterObject: { key: string, value: AdvanceSearchFilterConfig }) {
        this.resetPagination();
        if (filterObject.value.value !== "") {
            if((filterObject.value.value as KeyValueView).key){
                filterObject.value.appliedValue = (filterObject.value.value as KeyValueView).key as string;
            }else{
                filterObject.value.appliedValue = filterObject.value.value;
            }
            filterObject.value.isApplied = true;
        } else {
            filterObject.value.isApplied = false;
            filterObject.value.appliedValue = "";
        }
        this.setFilterIsApplied();
        this.searchEventEmitter.emit();
    }
    
    filterSearchableDropdownChange(filterObject: { key: string, value: AdvanceSearchFilterConfig }, selectedObject: any) {

        if(filterObject.value.searchByLable=="Search By Customer") {
            this.searchLocationByCustomerComponentFunction(selectedObject);
        }
        if(filterObject.value.searchByLable=="Search By Branch Name") {
            this.searchMachineByLocationComponentFunction(selectedObject);
        }
        filterObject.value.value = selectedObject;
        this.filterData(filterObject);
    }

    searchLocationByCustomerComponentFunction(selectedObject){    
        this.eventEmitterService.searchLocationByCustomerComponentFunction(selectedObject);    
    }

    searchMachineByLocationComponentFunction(selectedObject){    
        this.eventEmitterService.searchMachineByLocationComponentFunction(selectedObject);    
    }
      
    removeLocationByCustomerComponentFunction(){    
        this.eventEmitterService.removeLocationByCustomerComponentFunction();    
    }

    removeMachineByLocationComponentFunction(){    
        this.eventEmitterService.removeMachineByLocationComponentFunction();    
    }


    removeFilter(filterObject: { key: string, value: AdvanceSearchFilterConfig }) {
        this.resetPagination();

        if(filterObject.value.searchByLable=="Search By Customer") {
            this.removeLocationByCustomerComponentFunction();
        }
        if(filterObject.value.searchByLable=="Search By Branch Name") {
            this.removeMachineByLocationComponentFunction();
        }

        filterObject.value.value = "";
        filterObject.value.isApplied = false;
        filterObject.value.appliedValue = "";
        this.setFilterIsApplied();
        this.startDate = "";
        this.endDate = "";
        this.searchEventEmitter.emit();
    }
    resetPagination() {
        this.start = 0;
        this.recordSize = 0;
        this.items = [];
    }
    resetOrdering() {
        if (this.listContainer.listOrderConfig) {
            this.selectedOrderType = this.listContainer.listOrderConfig.defaultSelectedOrderType;
            this.selectedOrderParam = this.listContainer.listOrderConfig.defaultSelectedParameter;
        }
    }
    setFilterIsApplied() {
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.isApplied) {
                this.isFilterApplied = true;
            }
        });
    }

    add() {
        this.addEventEmitter.emit();
    }

    changeDisplayStyle(style: 'list' | 'card') {
        this.listContainer.defaultDisplayStyle = style;
    }

    changePageSize(event: PageEvent) {
        if (event.pageIndex != undefined && event.pageSize) {
            this.start = event.pageIndex * event.pageSize;
            this.pageSize = event.pageSize;
        }
        this.doFilterSearch();
    }

    doFilterSearch() {
        this.searchEventEmitter.emit();
    }

    onScroll() {
        if (this.start < this.recordSize) {
            this.doFilterSearch();
        }
    }

    setOrderParam(orderParam: KeyValueView) {
        this.selectedOrderParam = orderParam;
        this.resetPagination();
        this.searchEventEmitter.emit();
    }

    setOrderType(orderType: KeyValueView) {
        this.selectedOrderType = orderType;
        this.resetPagination();
        this.searchEventEmitter.emit();
    }

    filterDateChange(filterObject:{ key: string, value: AdvanceSearchFilterConfig },start:any,end:any){
        let startDate = new Date(start).setHours(0,0,0,0) / 1000
        let endDate;
        if (end === null) {
            endDate = new Date().setHours(23, 59, 0, 0) / 1000;
        } else {
            endDate = new Date(end).setHours(23, 59, 0, 0) / 1000;
        }
        filterObject.value.value = [{key : "start" , value : String(startDate)  },{key : "end" , value : String(endDate) }];
        this.filterData(filterObject);
    }

    export(){
          this.addExport.emit();
        }
}