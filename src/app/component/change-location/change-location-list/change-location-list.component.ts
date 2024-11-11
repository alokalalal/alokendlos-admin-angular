import { KeyValueView } from './../../../view/common/key-value-view';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChangeLocationView } from 'src/app/entities/change-location-view';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { ChangeLocationAddEditComponent } from '../change-location-add-edit/change-location-add-edit.component';
import { ModuleConfig } from 'src/app/constants/module-config';
import { SharedService } from 'src/app/services/shared.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ChangeLocationService } from '../change-location.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { FileService } from 'src/app/services/file.service';
import CommonUtility from 'src/app/utility/common.utility';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileView } from 'src/app/entities/file-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { MatDialog } from '@angular/material/dialog';
import { CommonResponse } from 'src/app/responses/common-response';
import { CustomerView } from 'src/app/entities/customer-view';
import { CustomerService } from 'src/app/services/customer.service';
import { LocationService } from 'src/app/services/location.service';
import { LocationView } from 'src/app/entities/location-view';
import { MachineService } from 'src/app/services/machine.service';
import { MachineView } from 'src/app/entities/machine-view';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { Sort } from '@angular/material/sort';
import { EventEmitterService } from 'src/app/services/event-emitter.service';


@Component({
  selector: 'app-change-location-list',
  templateUrl: './change-location-list.component.html',
  styleUrls: ['./change-location-list.component.css'],
  providers: [ChangeLocationService]
})
export class ChangeLocationListComponent implements OnInit {
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<ChangeLocationView>;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  
  public start: number = 0;
  public pageSize: number = 10;
  public recordSize!: number;
  public orderParam!: KeyValueView;
  private orderParamList: KeyValueView[] | undefined;
  public orderType: KeyValueView = OrderTypeEnum.DESC;
  id: KeyValueView;
  approve: KeyValueView;

  public listContainer: ListContainer = {
    pageTitle: "Change Location",
    accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.CHANGE_LOCATION),
    hasDisplayStyleButtons: false,
    defaultDisplayStyle: 'list',
    hasDisplayStylePagination: true,
    hasDisplayExportButton: true,
 };
  
    customerList: CustomerView[];
    machineList: MachineView[];
    activityStatusList: KeyValueView[];
    developmentStatusList: KeyValueView[];
    private locationList: LocationView[] | undefined;
    locationView=new LocationView();
    private cityList: KeyValueView[] | undefined;
    cityView:KeyValueView[] =[]
    changeLocationList: any;
    machineView: any;
   
    customerOptions: any;
    locationKeyValueViews: KeyValueView[] = [];
    machineKeyValueViews: KeyValueView[] = [];
    customerKeyValueViews: KeyValueView[] = [];
    advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private sharedService: SharedService,
    private changeLocationService: ChangeLocationService,
    private snackBarService: SnackBarService,
    private fileService: FileService,
    public dialog: MatDialog,
    private customerService: CustomerService,
    private locationService:LocationService,
    private machineService: MachineService,
    private eventEmitterService: EventEmitterService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.eventEmitterService.subsVar = this.eventEmitterService.invokeSearchByComponentFunction.subscribe((selectedObject) => {
        this.searchCustomerLocationFunction(selectedObject);    
      });  
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeSearchByComponentFunction2.subscribe((selectedObject) => {   
          this.searchLocationMachineFunction(selectedObject);    
        }); 
        this.eventEmitterService.subsVar = this.eventEmitterService.invokeRemoveByComponentFunction3.subscribe((selectedObject) => {   
          this.removeCustomerFunction(0);   
        }); 
        this.eventEmitterService.subsVar = this.eventEmitterService.invokeRemoveByComponentFunction4.subscribe((selectedObject) => {   
          this.removeBranchFunction();
        });
       
      await this.changeLocationService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.orderParam = response.list[0];
                this.orderParamList = response.list;
            }
        });
        if (this.orderParamList != undefined) {
            this.listContainer.listOrderConfig = {
                parameterList: this.orderParamList,
                defaultSelectedParameter: this.orderParamList[0],
                defaultSelectedOrderType: this.orderType
            }
        }

        await this.customerService.doGetCustomerDropdown().then((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.customerList = response.list;
            }
        });
        
        if (this.customerList != undefined) {
            this.customerList.forEach((customerView: CustomerView) => {
                this.customerKeyValueViews.push(new KeyValueView({ key: customerView.id, value: customerView.name }))
            })
            this.advanceSearchConfig.set("customerView", {
                lable: "Customer",
                placeHolder: "Customer",
                type: 'select',
                options: this.customerKeyValueViews,
                value: "",
                appliedValue: "",
                searchByLable: "Search By Customer",
                isApplied: false
            });
        }
        this.advanceSearchConfig.set("locationView", {
            lable: "location",
            placeHolder: "Branch Name",
            type: 'select',
            options: [],
            value: "",
            appliedValue: "",
            searchByLable: "Search By Branch Name",
            isApplied: false
        });
        
        this.getMachineData({});

        this.advanceSearchConfig.set("machineView", {
            lable: "Machine",
            placeHolder: "Machine Id",
            type: 'select',
            options: this.machineKeyValueViews,
            value: "",
            appliedValue: "",
            searchByLable: "Search By Machine",
            isApplied: false
        });
        this.advanceSearchConfig.set("date-range", {
            lable: "Search By start",
            placeHolder: "Search By Date",
            type: 'date-range',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Date",
            isApplied: false
        });
        this.listContainer.advanceSearchFilterConfig = this.advanceSearchConfig;
        this.loadChangeLocationList(this.start, this.pageSize, {});
    }
   
    accept(item: any){
         this.changeLocationService.doAccept(item.id, true).then((response: CommonResponse) => {
          if (response != undefined && response.code >= 1000 && response.code < 2000) {
              this.snackBarService.successSnackBar("Success");
              this.cardOrListViewComponent.resetPagination()
              this.searchEventEmitCall(); 
          }
        })      
    }

    reject(item: any){
        this.changeLocationService.doAccept(item.id, false).then((response: CommonResponse) => {
            if(response != undefined && response.code >= 1000 && response.code < 2000){
                this.snackBarService.errorSnackBar("Rejected");
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
        })   
    }

  loadChangeLocationList(start: number, pageSize: number, searchBody: any) {
    this.listContainerBlockUi.start();
    this.changeLocationService.doSearch(start, pageSize, this.orderType?.key, this.orderParam?.key, searchBody).subscribe(async (response: CommonListResponse<ChangeLocationView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.cardOrListViewComponent.items=[];
            response.list.forEach((element: ChangeLocationView) => {
                let machineView = new ChangeLocationView(element)
                this.cardOrListViewComponent.addItem(machineView)
                this.listContainer.hasDisplayExportButton=true
            });
            this.recordSize = response.records
            this.start = this.start + this.pageSize;
            this.cardOrListViewComponent.start = this.start;
            this.cardOrListViewComponent.recordSize = this.recordSize;
            this.cardOrListViewComponent.pageSize = this.pageSize;
        } else {
            this.listContainer.hasDisplayExportButton=false
            this.snackBarService.errorSnackBar(response.message);
        }
        this.listContainerBlockUi.stop();
    })
 }

 sortData(sort: Sort) {
    if (sort.direction == 'asc') {
        this.orderType = OrderTypeEnum.ASC;
    }
    if (sort.direction == 'desc') {
        this.orderType = OrderTypeEnum.DESC;
    }
    this.orderParamList.forEach(element => {
        if (element.value == sort.active) {
            this.orderParam = element;
        }
    });
    this.cardOrListViewComponent.start = 0;
    this.cardOrListViewComponent.recordSize = 0;
    this.searchEventEmitCall();
}


    searchEventEmitCall() {
    let searchBody = Object();
    this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
        if(value.isApplied) {
            switch (key) { 
                case "status":
                    searchBody[key] = { key: value.appliedValue };
                    break;
                case "customerView":
                case "locationView":
                case "machineView":
                    searchBody[key] = { id: value.appliedValue };
                    break;
                case "date-range":
                        let appliedValue: KeyValueView[] = value.appliedValue as KeyValueView[];
                        searchBody['startDate'] = appliedValue.find((d: KeyValueView) => d.key === 'start')?.value;
                        searchBody['endDate'] = appliedValue.find((d: KeyValueView) => d.key === 'end')?.value;
                        break;
                default:
                    searchBody[key] = value.appliedValue;
                    break;
            }
        }
    });
    this.start = this.cardOrListViewComponent.start;
    this.pageSize=this.cardOrListViewComponent.pageSize;
    this.loadChangeLocationList(this.start, this.pageSize, searchBody);
    }

  addEventEmitCall() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChangeLocationAddEditComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
        if (isReloadListData) {
            this.cardOrListViewComponent.resetPagination()
            this.searchEventEmitCall();
        }
        this.dynamicComponentContainer.detach();
    });
 }

    export() {
    let searchBody = Object();
    this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
        if(value.isApplied) {
            switch (key) { 
                case "status":
                case "customerView":
                case "locationView":
                case "machineView":
                    searchBody[key] = { id: value.appliedValue };
                    break;
                case "date-range":
                        let appliedValue: KeyValueView[] = value.appliedValue as KeyValueView[];
                        searchBody['startDate'] = appliedValue.find((d: KeyValueView) => d.key === 'start')?.value;
                        searchBody['endDate'] = appliedValue.find((d: KeyValueView) => d.key === 'end')?.value;
                        break;
                default:
                    searchBody[key] = value.appliedValue;
                    break;
            }
        }
    });
    this.exportList(searchBody);
    }

 exportList(searchBody: any) {
  this.listContainerBlockUi.start();
  this.changeLocationService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message);
          if (response.view.fileId) {
              this.fileService.doDownload(response.view.fileId).subscribe((fileResponse) => {
                  CommonUtility.downloadFile(response.view.name, fileResponse);
              })
          } else {
              this.snackBarService.errorSnackBar(response.message);
          }
      } else {
          this.snackBarService.errorSnackBar(response.message);
      }
      this.listContainerBlockUi.stop();
  })
 }

  editLocation(changeLocationView: ChangeLocationView,isEditView) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChangeLocationAddEditComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    changeLocationView.changeLocationView = {};
    changeLocationView.changeLocationView.isEditView = isEditView;
    componentRef.instance.dynamicComponentData = changeLocationView;
    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
        if (isReloadListData) {
            this.cardOrListViewComponent.resetPagination()
            this.searchEventEmitCall();
        }
        this.dynamicComponentContainer.detach();

        
    });
 }

 searchCustomerLocationFunction(selectedObject:any) {
    this.removeCustomerFunction(1);
    this.customerOptions = { id: selectedObject.key, name: selectedObject.value };
    let locationView1 = new LocationView();
    locationView1.customerView = new CustomerView(this.customerOptions);
    this.getMachineData(locationView1);
    this.locationKeyValueViews = [];
    this.locationService.doGetLocationDropdown(locationView1).then((response: CommonListResponse<LocationView>) => {
        
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                
                this.locationList = response.list;
                this.locationList.forEach((locationView: LocationView) => {
                    this.locationKeyValueViews.push(new KeyValueView({ key: locationView.id, value: locationView.name }));
                });
                this.advanceSearchConfig.set("locationView", {
                    lable: "location",
                    placeHolder: "Branch Name",
                    type: 'select',
                    options: this.locationKeyValueViews,
                    value: "",
                    appliedValue: "",
                    searchByLable: "Search By Branch Name",
                    isApplied: false
                });
                this.advanceSearchConfig.set("machineView", {
                    lable: "Machine",
                    placeHolder: "Machine Id",
                    type: 'select',
                    options: this.machineKeyValueViews,
                    value: "",
                    appliedValue: "",
                    searchByLable: "Search By Machine",
                    isApplied: false
                });
            }
            else {
                this.advanceSearchConfig.set("locationView", {
                    lable: "location",
                    placeHolder: "Branch Name",
                    type: 'select',
                    options: [],
                    value: "",
                    appliedValue: "",
                    searchByLable: "Search By Branch Name",
                    isApplied: false
                });
                this.advanceSearchConfig.set("machineView", {
                    lable: "Machine",
                    placeHolder: "Machine Id",
                    type: 'select',
                    options: this.machineKeyValueViews,
                    value: "",
                    appliedValue: "",
                    searchByLable: "Search By Machine",
                    isApplied: false
                });                   
            }
        });
    }
  searchLocationMachineFunction(selectedObject:any) {
    let locationOptions:any = { id: selectedObject.key, name: selectedObject.value };

    let machineView = new MachineView();
    machineView.locationView = new LocationView(locationOptions);
    machineView.customerView = new CustomerView(locationOptions);
    this.machineKeyValueViews = [];
    this.machineService.doGetMachineDropdownWithPara(machineView).then((response: CommonListResponse<CustomerView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.machineList = response.list;

            //if (this.machineList != undefined && this.machineView==undefined) {
                    this.machineList.forEach((machineView: MachineView) => {
                        this.machineKeyValueViews.push(new KeyValueView({ key: machineView.id, value: machineView.machineId }))
                    })
                this.advanceSearchConfig.set("machineView", {
                    lable: "Machine",
                    placeHolder: "Machine Id",
                    type: 'select',
                    options: this.machineKeyValueViews,
                    value: "",
                    appliedValue: "",
                    searchByLable: "Search By Machine",
                    isApplied: false
                });
            //}
        }
        else {
            this.advanceSearchConfig.set("machineView", {
                lable: "Machine",
                placeHolder: "Machine Id",
                type: 'select',
                options: this.machineKeyValueViews,
                value: "",
                appliedValue: "",
                searchByLable: "Search By Machine",
                isApplied: false
            });
        }
    });
  }
  removeCustomerFunction(isSetMachine) { 
    if(isSetMachine == 0) {
        this.getMachineData({});
        this.machineKeyValueViews = [];
    }
    this.advanceSearchConfig.set("machineView", {
        lable: "Machine",
        placeHolder: "Machine Id",
        type: 'select',
        options: [],
        value: "",
        appliedValue: "",
        searchByLable: "Search By Machine",
        isApplied: false
    });
    this.advanceSearchConfig.set("locationView", {
        lable: "location",
        placeHolder: "Branch Name",
        type: 'select',
        options: [],
        value: "",
        appliedValue: "",
        searchByLable: "Search By Branch Name",
        isApplied: false
    });
  }
  removeBranchFunction() {
    this.machineView.customerView = this.customerOptions
    this.getMachineData(this.machineView);
    this.advanceSearchConfig.set("machineView", {
        lable: "Machine",
        placeHolder: "Machine Id",
        type: 'select',
        options: this.machineKeyValueViews,
        value: "",
        appliedValue: "",
        searchByLable: "Search By Machine",
        isApplied: false
    });
  }
  getMachineData(machineView:any) {
    if(Object.keys(machineView).length === 0)
    {
        this.machineKeyValueViews;
        this.machineService.doGetMachineDropdown().then((response: CommonListResponse<MachineView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.machineList = response.list;
                    this.machineList.forEach((machineView: MachineView) => {
                        this.machineKeyValueViews.push(new KeyValueView({ key: machineView.id, value: machineView.machineId }))
                    })
                    this.advanceSearchConfig.set("machineView", {
                        lable: "Machine",
                        placeHolder: "Machine Id",
                        type: 'select',
                        options: this.machineKeyValueViews,
                        value: "",
                        appliedValue: "",
                        searchByLable: "Search By Machine",
                        isApplied: false
                    });
            }
        });
    }
    else if(Object.keys(machineView).length > 0 && machineView.customerView) {

        this.machineKeyValueViews = [];
        this.machineService.doGetMachineDropdownWithPara(machineView).then((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {                    
                this.machineList = response.list;
                    this.machineList.forEach((machineView: MachineView) => {
                        this.machineKeyValueViews.push(new KeyValueView({ key: machineView.id, value: machineView.machineId }))
                    })
                    this.advanceSearchConfig.set("machineView", {
                        lable: "Machine",
                        placeHolder: "Machine Id",
                        type: 'select',
                        options: this.machineKeyValueViews,
                        value: "",
                        appliedValue: "",
                        searchByLable: "Search By Machine",
                        isApplied: false
                    });
                //}
            }
        });

    } 
  }
}






