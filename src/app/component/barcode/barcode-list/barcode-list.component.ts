import { DatePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ApiConfig } from 'src/app/api.config';
import { AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { BarcodeView } from 'src/app/entities/barcode-view';
import { MachineView } from 'src/app/entities/machine-view';
import { ListContainerFilter } from 'src/app/Interface/list-container-filter';
import { MachineService } from 'src/app/services/machine.service';
import { SharedService } from 'src/app/services/shared.service';
import { ListContainerAdvanceSearchFilterInterface } from '../../../Interface/list-container-advance-search-filter';
import { FullTextSearchComponent } from '../../common/full-text-search/full-text-search.component';
import { ListContainerFilterComponent } from '../../common/list-container-filter/list-container-filter.component';
import { ListComponent } from '../../common/list/list.component';
import { BarcodeService } from '../barcode.service';
import { AcceessRightsInterface } from './../../../Interface/acceess-rights';

@Component({
  selector: 'app-barcode-list',
  templateUrl: './barcode-list.component.html',
  styleUrls: ['./barcode-list.component.css'],
  providers: [DatePipe]
})
export class BarcodeListComponent implements OnInit {
  @ViewChild(ListComponent) listComponent!: ListComponent;
  @ViewChild(FullTextSearchComponent) fullTextSearchComponent!: FullTextSearchComponent;
  @ViewChild(ListContainerFilterComponent) listContainerFilterComponent!: ListContainerFilterComponent;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  public accessRightsJson?: AcceessRightsInterface;
  appUrl = AppUrl;
  apiConfig = ApiConfig;
  public tabFilterButtonArray: Array<ListContainerFilter> = [];

  public columns = [
    { columnDef: 'barcode', header: 'Barcode', class: "width-30", cell: (element: BarcodeView) => element.barcode ? `${element.barcode}` : '' },
    { columnDef: 'description', header: 'description', class: "width-30", cell: (element: BarcodeView) => element.description ? `${element.description}` : '' },
    { columnDef: 'dataAcquisition', header: 'dataAcquisition', class: "width-30", cell: (element: BarcodeView) => element.dataAcquisition ? `${element.dataAcquisition}` : '' },
    { columnDef: 'iteamRedeemValue', header: 'iteamRedeemValue', class: "width-30", cell: (element: BarcodeView) => element.iteamRedeemValue ? `${element.iteamRedeemValue}` : '' },
    { columnDef: 'volumn', header: 'volumn', class: "width-30", cell: (element: BarcodeView) => element.volumn ? `${element.volumn}` : '' },
    { columnDef: 'dateCreate', header: 'Date and Time', class: "width-20", cell: (element: BarcodeView) => element.dateCreate ? this.datePipe.transform(element.dateCreate * 1000, 'medium') : '' },
    { columnDef: 'machineName', header: 'Machine Name', class: "width-30", cell: (element: BarcodeView) => element.machineView.machineName ? `${element.machineView.machineName}` : '' },
    {
      columnDef: 'action', header: 'Action', class: "width-10", cell: (element: MachineView) => element, menu: [
        { name: "view" },
        { name: "edit" }
      ]
    },
  ];


  constructor(
    public barcodeService: BarcodeService, private sharedService: SharedService,
    private machineService: MachineService, private componentFactoryResolver: ComponentFactoryResolver,
    private datePipe: DatePipe
  ) {
    this.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.MACHINE);
    this.getMachineDropdown();
  }

  ngAfterViewInit(): void {
    if (this.barcodeService.searchFilterArray != undefined && this.barcodeService.searchFilterArray.length > 0) {
      this.barcodeService.searchFilterArray.forEach((element: ListContainerAdvanceSearchFilterInterface) => {
        if (element.actionObject == "fullTextSearch") {
          this.fullTextSearchComponent.searchInput = element.value;
        }
      });
    }
  }

  ngOnInit(): void {
  }

  getMachineDropdown() {
    this.machineService.doSearch(0, '', '', '', {}).subscribe(res => {
      if (res.code >= 1000 && res.code < 2000) {
        res.list.forEach((element: MachineView) => {
          this.tabFilterButtonArray.push({
            name: element.machineName,
            value: element.id,
            isSelected: false
          })
        });
      }
    })
  }

  machineFilter(data: any) {
    if (this.barcodeService.searchFilterArray.find(e => e.actionObject == "machineView")) {
      this.barcodeService.searchFilterArray.splice(this.barcodeService.searchFilterArray.findIndex(e => e.actionObject == "machineView"), 1);
    }
    this.barcodeService.searchFilter.machineView = { id: data.value };
    this.barcodeService.searchFilterArray.push({
      label: "Search By Machine",
      value: data.name,
      actionObject: "machineView"
    })
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  // transactionIdSearch(data: any) {
  //   if (this.barcodeService.searchFilterArray.find(e => e.actionObject == "transactionId")) {
  //     this.barcodeService.searchFilterArray.splice(this.barcodeService.searchFilterArray.findIndex(e => e.actionObject == "transactionId"), 1);
  //   }
  //   this.barcodeService.searchFilter.transactionId = data;
  //   if (data != undefined && data != "") {
  //     this.barcodeService.searchFilterArray.push({
  //       label: "Search By Transaction Id",
  //       value: data,
  //       actionObject: "transactionId"
  //     })
  //   }
  //   this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  // }

  removeSearchObjectEvent(data: String) {
    if (this.barcodeService.searchFilterArray.find(e => e.actionObject == data)) {
      this.barcodeService.searchFilterArray.splice(this.barcodeService.searchFilterArray.findIndex(e => e.actionObject == data), 1);
    }
    // if (data == "transactionId") {
    //   delete this.barcodeService.searchFilter.transactionId;
    //   this.fullTextSearchComponent.searchInput = '';
    // }
    if (data == 'machineView') {
      delete this.barcodeService.searchFilter.machineView;
      this.listContainerFilterComponent.dropdownFilterControl = '';
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  getCommonEventEmitterFunction(object: { data: any, actionName: string }) {
    // if (object.actionName == "view") {
    // }
    if (object.actionName == "edit") {
      this.edit(object?.data);
    }

  }
  edit(data: any) {
    this.barcodeService.doEditData(data.machineView.id, data.id);
  }

}
