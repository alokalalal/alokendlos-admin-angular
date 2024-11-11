import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { FileView } from 'src/app/entities/file-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileService } from 'src/app/services/file.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import CommonUtility from 'src/app/utility/common.utility';
import { MachineView } from '../../../entities/machine-view';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { ModuleConfig } from './../../../constants/module-config';
import { CustomerView } from './../../../entities/customer-view';
import { LocationView } from 'src/app/entities/location-view';
import { AdvanceSearchFilterConfig, ListContainer } from './../../../Interface/list-container';
import { CustomerService } from './../../../services/customer.service';
import { LocationService } from 'src/app/services/location.service';
import { MachineService } from './../../../services/machine.service';
import { SharedService } from './../../../services/shared.service';
import { KeyValueView } from './../../../view/common/key-value-view';
import { AssignToCustomerComponent } from './../assign-to-customer/assign-to-customer.component';
import { MachineAddEditComponent } from './../machine-add-edit/machine-add-edit.component';
import { Sort } from '@angular/material/sort';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { CommonResponse } from 'src/app/responses/common-response';

@Component({
    selector: 'app-machine-list-or-card',
    templateUrl: './machine-list-or-card.component.html',
    styleUrls: ['./machine-list-or-card.component.scss']
})
export class MachineListOrCardComponent implements OnInit {
    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<MachineView>;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    @Input() selectedObject!: any;

    public start: number = 0;
    public pageSize: number = 10;
    public recordSize!: number;
    public orderType: KeyValueView = OrderTypeEnum.DESC;
    public orderParam!: KeyValueView;
    private orderParamList: KeyValueView[] | undefined;
    private customerList: CustomerView[] | undefined;
    private activityStatusList: KeyValueView[] | undefined;
    private developmentStatusList: KeyValueView[] | undefined;
    private machineTypeList: KeyValueView[] | undefined;
    public machineDropdownList: MachineView[] | undefined;

    public listContainer: ListContainer = {
        pageTitle: "Machine",
        accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.MACHINE),
        hasDisplayStyleButtons: true,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: true,
        hasDisplayExportButton: true,
    };

    private locationList: LocationView[] | undefined;
    private machineList: MachineView[] | undefined;
    machineView = new MachineView();
    locationView = new LocationView();

    private cityList: KeyValueView[] | undefined;
    cityView: KeyValueView[] = []

    customerOptions: any;        
    customerKeyValueViews: KeyValueView[] = [];
    locationKeyValueViews: KeyValueView[] = [];
    machineKeyValueViews: KeyValueView[] = [];

    advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
    constructor(
        private machineService: MachineService,
        private sharedService: SharedService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private router: Router,
        private snackBarService: SnackBarService,
        private customerService: CustomerService,
        private fileService: FileService,
        private locationService:LocationService,
        private eventEmitterService: EventEmitterService
        
    ) {
        
    }

    async ngOnInit() {
        
        //if (this.eventEmitterService.subsVar==undefined) {
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
        //} 
        await this.machineService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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
        this.advanceSearchConfig.set("fullTextSearch", {
            lable: "Search By Machine Id",
            placeHolder: "Search By Machine Id",
            type: 'fullTextSearch',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Machine Id",
            isApplied: false
        });
       /* this.advanceSearchConfig.set("date-range", {
            lable: "Search By start",
            placeHolder: "Search By Date",
            type: 'date-range',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Date",
            isApplied: false
        });*/
        this.listContainer.advanceSearchFilterConfig = this.advanceSearchConfig;
        this.loadMachineList(this.start, this.pageSize, {});
    }

    loadMachineList(start: number, pageSize: number, searchBody: any) {
        this.listContainerBlockUi.start();
        this.machineService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<MachineView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.items=[];
                response.list.forEach((element: MachineView) => {
                    let machineView = new MachineView(element)
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

    view(machine: MachineView) {
        this.router.navigate([AppUrl.MACHINE + '/' + AppUrl.VIEW_OPERATION + '/' + machine.id])
    }

    edit(machine: MachineView) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = machine;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach();
        });
    }

    assign(machine: MachineView) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AssignToCustomerComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = machine;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach();
        });
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
            if (value.isApplied) {
                switch (key) {
                    case "customerView":
                    case "locationView":
                        searchBody[key] = { id: value.appliedValue };
                        break;
                    case "machineView":
                        searchBody["fullTextSearch"] = value.value["value"] ;
                        break;
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        this.start = this.cardOrListViewComponent.start;
        this.pageSize=this.cardOrListViewComponent.pageSize;

        this.loadMachineList(this.start, this.pageSize, searchBody);
    }

    addEventEmitCall() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineAddEditComponent);
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
            if (value.isApplied) {
                switch (key) {
                    case "customerView":
                    case "locationView":
                    case "machineType":   
                    case "machineDevelopmentStatus":
                    case "machineActivityStatus":
                        searchBody[key] = { id: value.appliedValue };
                        break;
                    case "machineView":
                        searchBody["fullTextSearch"] = value.value["value"] ;
                        break;
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        // this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
        // this.orderType = this.cardOrListViewComponent.selectedOrderType;
        this.exportList(searchBody);
    }

    exportList(searchBody: any) {
        //this.listContainerBlockUi.start();
        this.machineService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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
            //this.listContainerBlockUi.stop();
        });
        this.snackBarService.successSnackBar("Export process has started. Please wait for the file to be generated.");
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

      activeInactiveRowData(machine: MachineView){
        this.machineService.doActiveInactive(machine).then((response: CommonResponse) => {
            this.cardOrListViewComponent.resetPagination()
            this.searchEventEmitCall();
        });
      }
}