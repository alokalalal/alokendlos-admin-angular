import { Component, OnInit, ViewChild, ViewContainerRef, Input} from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { Sort } from '@angular/material/sort';
import { CardOrListViewComponent } from 'src/app/component/common/card-or-list-view/card-or-list-view.component';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { OrderTypeEnum } from 'src/app/component/common/card-or-list-view/enum/order-type-enum';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { PickupRouteService } from 'src/app/services/pickup-route.service';
import { PickupRouteView } from 'src/app/entities/pickup-route-view';
import { LogisticCurrentFullnessLogView } from 'src/app/entities/logistic-current-fullness-log-view';
import { FileView } from 'src/app/entities/file-view';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileService } from 'src/app/services/file.service';
import CommonUtility from 'src/app/utility/common.utility';
import { CustomerView } from 'src/app/entities/customer-view';
import { LocationView } from 'src/app/entities/location-view';
import { MachineView } from 'src/app/entities/machine-view';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { MachineService } from 'src/app/services/machine.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocationService } from 'src/app/services/location.service';


@Component({
  selector: 'app-logistic-pickup-logs-per-machine-component',
  templateUrl: './logistic-pickup-logs-per-machine-component.component.html',
  styleUrls: ['./logistic-pickup-logs-per-machine-component.component.css']
})
export class LogisticPickupLogsPerMachineComponentComponent implements OnInit {
    
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<LogisticCurrentFullnessLogView>;
  @Input() machineView;
  appUrl = AppUrl;
  apiurl = Apiurl;
  apiUrlParameter = ApiUrlParameter;
  public start: number = 0;
  public pageSize: number = 10;
  public recordSize!: number;
  public orderType: KeyValueView = OrderTypeEnum.DESC;
  public orderParam!: KeyValueView;
  private orderParamList: KeyValueView[] | undefined;
  isOpenLocationContent: boolean = false;
  logisticCurrentFullnessLogModel: LogisticCurrentFullnessLogView = new LogisticCurrentFullnessLogView();
  locationId:number;
  public location_count: number = 3;

  advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
  machineKeyValueViews: KeyValueView[] = [];
  private customerList: CustomerView[] | undefined;
  customerKeyValueViews: KeyValueView[] = [];
  customerOptions: any;
  private locationKeyValueViews: KeyValueView[] = [];
  private locationList: LocationView[] | undefined;
  private machineList: MachineView[] | undefined;

  private pickupRouteList: MachineView[] | undefined;
  pickupRouteValueViews: KeyValueView[] = [];
  
  public listContainer: ListContainer = {
      pageTitle: "Pickup Logs per Machine",
      accessRightsJson: {
          isAccessRightAdd: false,
          isAccessRightEdit: false,
          isAccessRightDelete: false,
          isAccessRightView: false,
          isAccessRightActivation: false,
          isAccessRightList: false,
      },
      hasDisplayStyleButtons: false,
      defaultDisplayStyle: 'list',
      hasDisplayStylePagination: true,
      hasDisplayExportButton: true,
  }
  
  constructor(
      public pickupRouteService: PickupRouteService,
      private snackBarService: SnackBarService,
      private fileService: FileService,
      private eventEmitterService: EventEmitterService,
      private machineService: MachineService,
      private customerService: CustomerService,
      private locationService:LocationService
  ) {}

  async ngOnInit() {
      /* await this.pickupRouteService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
          if (response != undefined && response.code >= 1000 && response.code < 2000) {
              this.orderParam = response.list[1];
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

      let advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
      advanceSearchConfig.set("fullTextSearch", {
          lable: "Search By Machine Id",
          placeHolder: "Search By Machine Id",
          type: 'fullTextSearch',
          value: "",
          appliedValue: "",
          searchByLable: "Search By Machine Id",
          isApplied: false
      });
      this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
      this.loadPickupRouteList(this.start, this.pageSize, {}) */

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
        await this.pickupRouteService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.orderParam = response.list[1];
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
            //alert(JSON.stringify(new KeyValueView({ key: customerView.id, value: customerView.name })));
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
    
    this.pickupRouteService.doGetPickupRouteDropdown().then((response: CommonListResponse<PickupRouteView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.pickupRouteList = response.list;
                this.pickupRouteList.forEach((pickupRouteView: PickupRouteView) => {
                    this.pickupRouteValueViews.push(new KeyValueView({ key: pickupRouteView.id, value: pickupRouteView.name }))
                })
                this.advanceSearchConfig.set("pickupRouteView", {
                    lable: "Pickroute",
                    placeHolder: "Pickup Route Name",
                    type: 'select',
                    options: this.pickupRouteValueViews,
                    value: "",
                    appliedValue: "",
                    searchByLable: "Search By Pickup Route Name",
                    isApplied: false
                });
        }
    });

    //let advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
    this.advanceSearchConfig.set("fullTextSearch", {
        lable: "Search By Pickup Route Name",
        placeHolder: "Search By Pickup Route",
        type: 'fullTextSearch',
        value: "",
        appliedValue: "",
        searchByLable: "Search By Pickup Route Name",
        isApplied: false
    });
    this.listContainer.advanceSearchFilterConfig = this.advanceSearchConfig;
    this.loadPickupRouteList(this.start, this.pageSize, {})
  }
  
  loadPickupRouteList(start: number, pageSize: number, searchBody: any) {
      this.listContainerBlockUi.start();
      this.pickupRouteService.getLogisticPickupLogsPerMachine(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<LogisticCurrentFullnessLogView>) => {
          if (response != undefined && response.code >= 1000 && response.code < 2000) {
              this.cardOrListViewComponent.items=[];
              response.list.forEach((element: LogisticCurrentFullnessLogView) => {
                  let logisticCurrentFullnessLogView = new LogisticCurrentFullnessLogView(element)
                  this.cardOrListViewComponent.addItem(logisticCurrentFullnessLogView)
              });
              this.recordSize = response.records
              this.start = this.start + this.pageSize;
              this.cardOrListViewComponent.start = this.start;
              this.cardOrListViewComponent.recordSize = this.recordSize;
              this.cardOrListViewComponent.pageSize = this.pageSize;
          } else {
              this.snackBarService.errorSnackBar(response.message);
          }
      })
      this.listContainerBlockUi.stop();
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
                case "locationView":
                case "customerView":
                    searchBody[key] = { id: value.appliedValue };
                    break;
                case "date-range":
                    let appliedValue: KeyValueView[] = value.appliedValue as KeyValueView[];
                    searchBody['startDate'] = appliedValue.find((d: KeyValueView) => d.key === 'start')?.value;
                    searchBody['endDate'] = appliedValue.find((d: KeyValueView) => d.key === 'end')?.value;
                    break
                case "machineView":
                    searchBody['machineId'] =  value.value['value'];
                    break;
                case "pickupRouteView":               
                    searchBody["fullTextSearch"]  = value.value["value"];
                    break;
                case "fullTextSearch": 
                    searchBody['fullTextSearch'] = value.appliedValue
                break;
                default:
                  //searchBody['pickupRouteView'] = value.appliedValue
                  searchBody['machineId'] =  value.value['value'];
                    break;
            }
        }
    });
    this.start = this.cardOrListViewComponent.start;
    this.pageSize=this.cardOrListViewComponent.pageSize;

    if(this.machineView!=undefined)
    {
        searchBody["machineId"] = {id:this.machineView.id}
    }
    console.log(JSON.stringify(searchBody));
    this.loadPickupRouteList(this.start, this.pageSize, searchBody);
}

export() {
    let searchBody = Object();
    this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
      if (value.isApplied) {
        switch (key) {
            case "locationView":
            case "customerView":
                searchBody[key] = { id: value.appliedValue };
                break;
            case "date-range":
                let appliedValue: KeyValueView[] = value.appliedValue as KeyValueView[];
                searchBody['startDate'] = appliedValue.find((d: KeyValueView) => d.key === 'start')?.value;
                searchBody['endDate'] = appliedValue.find((d: KeyValueView) => d.key === 'end')?.value;
                break
            case "machineView":
                searchBody['machineId'] =  value.value['value'];
                break;
            case "pickupRouteView":               
                searchBody["fullTextSearch"]  = value.value["value"];
                break;
            case "fullTextSearch": 
                searchBody['fullTextSearch'] = value.appliedValue
            break;
            default:
              //searchBody['pickupRouteView'] = value.appliedValue
              searchBody['machineId'] =  value.value['value'];
                break;
          }
      }
    });
    this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
    this.orderType = this.cardOrListViewComponent.selectedOrderType;
    this.exportList(searchBody);
}

exportList(searchBody: any) {
      this.listContainerBlockUi.start();
      this.pickupRouteService.doExportPickupLogsperMachine(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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
