import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ApiConfig } from 'src/app/api.config';
import { AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { MachineErrorType } from 'src/app/entities/machine-error-type';
import { MachineErrorTypeService } from 'src/app/services/machine-error-type.service';
import { SharedService } from 'src/app/services/shared.service';
import { AcceessRightsInterface } from '../../../Interface/acceess-rights';
import { ListContainerAdvanceSearchFilterInterface } from '../../../Interface/list-container-advance-search-filter';
import { FullTextSearchComponent } from '../../common/full-text-search/full-text-search.component';
import { ListContainerFilterComponent } from '../../common/list-container-filter/list-container-filter.component';
import { ListComponent } from '../../common/list/list.component';
import { MachineErrorTypeAddEditComponent } from '../machine-error-type-add-edit/machine-error-type-add-edit.component';
import { ListContainerFilter } from './../../../Interface/list-container-filter';

@Component({
  selector: 'app-machine-error-type-list',
  templateUrl: './machine-error-type-list.component.html',
  styleUrls: ['./machine-error-type-list.component.css']
})
export class MachineErrorTypeListComponent implements OnInit {
  @ViewChild(ListComponent) listComponent!: ListComponent;
  @ViewChild(FullTextSearchComponent) fullTextSearchComponent!: FullTextSearchComponent;
  @ViewChild(ListContainerFilterComponent) tabFilterComponent!: ListContainerFilterComponent;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  public accessRightsJson?: AcceessRightsInterface;
  public appUrl = AppUrl;
  public apiConfig = ApiConfig;
  public tabFilterButtonArray: Array<ListContainerFilter> = [
    {
      name: "All",
      value: 0,
      isSelected: true
    }
  ];
  public columns = [
    { columnDef: 'errorName', header: 'Error Name', class: "width-20", cell: (element: MachineErrorType) => `${element.errorName}` },
    { columnDef: 'address', header: 'PLC Read Address', class: "width-20", cell: (element: MachineErrorType) => `${element.address}` },
    { columnDef: 'type', header: 'PLC Address Type', class: "width-20", cell: (element: MachineErrorType) => `${element.type.value}` },
    { columnDef: 'coilErrorValue', header: 'Coil Error Value', class: "width-20", cell: (element: MachineErrorType) => `${element.coilErrorValue}` },
    { columnDef: 'regErrorValue', header: 'Register Error Value', class: "width-20", cell: (element: MachineErrorType) => `${element.regErrorValue}` },
    {
      columnDef: 'action', header: 'Action', class: "width-20", cell: (element: MachineErrorType) => element, menu: [
        { name: "edit" },
        { name: "delete" }
      ]
    },
  ];

  constructor(
    public machineErrorTypeService: MachineErrorTypeService, private sharedService: SharedService, private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.MACHINE_ERROR_TYPE);
  }

  ngAfterViewInit(): void {
    if (this.machineErrorTypeService.searchFilterArray != undefined && this.machineErrorTypeService.searchFilterArray.length > 0) {
      this.machineErrorTypeService.searchFilterArray.forEach((element: ListContainerAdvanceSearchFilterInterface) => {
        switch (element.actionObject) {
          case "fullTextSearch": {
            this.fullTextSearchComponent.searchInput = element.value;
            break;
          }
          case "active": {
            this.tabFilterButtonArray.forEach(e => {
              e.isSelected = false;
              if ((element.value == "Active" && e.value == 1) || element.value == "In Active" && e.value == 2) {
                e.isSelected = true;
              }
            })
            this.tabFilterComponent.buttonArray = this.tabFilterButtonArray;
            break;
          }
        }
      });
    }
  }

  ngOnInit(): void {
  }

  tabFilter(data: ListContainerFilter) {
    if (this.machineErrorTypeService.searchFilterArray.find(e => e.actionObject == "active")) {
      this.machineErrorTypeService.searchFilterArray.splice(this.machineErrorTypeService.searchFilterArray.findIndex(e => e.actionObject == "active"), 1);
    }
    if (data.value == 0) {
      delete this.machineErrorTypeService.searchFilter.active;

    } else if (data.value == 1) {
      this.machineErrorTypeService.searchFilter.active = true;
      this.machineErrorTypeService.searchFilterArray.push({
        label: "Search By active",
        value: "Active",
        actionObject: "active"
      })
    } else if (data.value == 2) {
      this.machineErrorTypeService.searchFilter.active = false;
      this.machineErrorTypeService.searchFilterArray.push({
        label: "Search By active",
        value: "In Active",
        actionObject: "active"
      })
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  fulltextsearch(data: any) {
    if (this.machineErrorTypeService.searchFilterArray.find(e => e.actionObject == "fullTextSearch")) {
      this.machineErrorTypeService.searchFilterArray.splice(this.machineErrorTypeService.searchFilterArray.findIndex(e => e.actionObject == "fullTextSearch"), 1);
    }
    this.machineErrorTypeService.searchFilter.machineName = data;
    if (data != undefined && data != "") {
      this.machineErrorTypeService.searchFilterArray.push({
        label: "Search By Name",
        value: data,
        actionObject: "fullTextSearch"
      })
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  removeSearchObjectEvent(data: String) {
    if (this.machineErrorTypeService.searchFilterArray.find(e => e.actionObject == data)) {
      this.machineErrorTypeService.searchFilterArray.splice(this.machineErrorTypeService.searchFilterArray.findIndex(e => e.actionObject == data), 1);
    }
    if (data == "fullTextSearch") {
      delete this.machineErrorTypeService.searchFilter.machineName;
      this.fullTextSearchComponent.searchInput = '';
    }
    if (data == "active") {
      delete this.machineErrorTypeService.searchFilter.active;
      this.tabFilterComponent.filterData(this.tabFilterButtonArray[0]);
    } else {
      this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
    }
  }

  getCommonEventEmitterFunction(object: { data: any, actionName: string }) {
    if (object.actionName == "edit") {
      this.edit(object?.data);
    }
  }

  edit(dynamicComponentData: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineErrorTypeAddEditComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentData = dynamicComponentData;
    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
      if (isReloadListData) {
        this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize)
      }
      this.dynamicComponentContainer.detach();
    });
  }

  add() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineErrorTypeAddEditComponent);
    console.log(componentFactory)
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
      if (isReloadListData) {
        this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize)
      }
      this.dynamicComponentContainer.detach();
    });
  }

}
