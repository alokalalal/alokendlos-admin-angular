import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CardOrListViewComponent } from 'src/app/component/common/card-or-list-view/card-or-list-view.component';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { OrderTypeEnum } from 'src/app/component/common/card-or-list-view/enum/order-type-enum';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { DailyPickupAssigneeService } from 'src/app/services/daily-pickup-assignee.service';
import CommonUtility from 'src/app/utility/common.utility';
import { FileService } from 'src/app/services/file.service';
import { MachineView } from 'src/app/entities/machine-view';
import { PickupRouteService } from 'src/app/services/pickup-route.service';
import { PickupRouteView } from 'src/app/entities/pickup-route-view';
import { CustomerView } from 'src/app/entities/customer-view';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocationView } from 'src/app/entities/location-view';
import { LocationService } from 'src/app/services/location.service';
import { MachineService } from 'src/app/services/machine.service';

@Component({
  selector: 'app-daily-pickup-assignee-list',
  templateUrl: './daily-pickup-assignee-list.component.html',
  styleUrls: ['./daily-pickup-assignee-list.component.css']
})
export class DailyPickupAssigneeListComponent implements OnInit {
    
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<MachineView>;
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
  dailyPickupAssigneeModel: MachineView = new MachineView();
  locationId:number;
  public location_count: number = 3;
  private pickupRouteList: MachineView[] | undefined;
  pickupRouteValueViews: KeyValueView[] = [];

  advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
  private customerList: CustomerView[] | undefined;
  customerKeyValueViews: KeyValueView[] = [];
  machineKeyValueViews: KeyValueView[] = [];
  customerOptions: any;
  private locationKeyValueViews: KeyValueView[] = [];
  private locationList: LocationView[] | undefined;
  private machineList: MachineView[] | undefined;

  public listContainer: ListContainer = {
      pageTitle: "Daily Pickup Assignee",
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
      hasDisplayExportButton: false,
  }
  
  constructor(
      public dailyPickupAssigneeService: DailyPickupAssigneeService,
      private sharedService: SharedService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private snackBarService: SnackBarService,
      private fileService:FileService,
      private pickupRouteService:PickupRouteService,
      private eventEmitterService: EventEmitterService,
      private customerService: CustomerService,
      private locationService:LocationService,
      private machineService: MachineService
  ) {
    //   this.listContainer.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.PICKUP_ROUTE);
  }

  async ngOnInit() {
    //let advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
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
    this.advanceSearchConfig.set("date-range", {
        lable: "Search By start",
        placeHolder: "Search By Date",
        type: 'date-range',
        value: "",
        appliedValue: "",
        searchByLable: "Search By Date",
        isApplied: false
    });

    this.advanceSearchConfig.set("fullTextSearch", {
        lable: "Search By Route Name",
        placeHolder: "Search By Route Name",
        type: 'fullTextSearch',
        value: "",
        appliedValue: "",
        searchByLable: "Search By Route Name",
        isApplied: false
    });
    this.listContainer.advanceSearchFilterConfig = this.advanceSearchConfig;
    this.loadPickupRouteList(this.start, this.pageSize, {})
  }
  
  loadPickupRouteList(start: number, pageSize: number, searchBody: any) {
      this.listContainerBlockUi.start();
      this.dailyPickupAssigneeService.doSearch(start, pageSize, searchBody).subscribe((response: CommonListResponse<MachineView>) => {
          if (response != undefined && response.code >= 1000 && response.code < 2000) {
              this.cardOrListViewComponent.items=[];
              response.list.forEach((element: MachineView) => {
                  let dailyPickupAssigneeView = new MachineView(element)
                  this.cardOrListViewComponent.addItem(dailyPickupAssigneeView)
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

  searchEventEmitCall() {
      let searchBody = Object();
      this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
        /* if (value.isApplied) {
            switch (key) {
                case "pickupRouteView":
                    searchBody[key] = { id: value.appliedValue };
                    break;
                default:
                    searchBody[key] = value.appliedValue;
                    break;
            }
        } */
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
                    searchBody[key] = { id: value.appliedValue };
                    break;
                case "pickupRouteView":
                    searchBody[key] = { id: value.appliedValue };
                    break;
                default:
                    searchBody["fullTextSearch"] = value.appliedValue;
                    break;
            }
        }

      });
      this.start = this.cardOrListViewComponent.start;
      this.pageSize=this.cardOrListViewComponent.pageSize;
      this.loadPickupRouteList(this.start, this.pageSize, searchBody);
  }

  closePickupRouteModal() {
      this.isOpenLocationContent = false;
      this.dynamicComponentContainer.detach();
  }

  selectAllRow: boolean = false;

  export(){
    // this.listContainerBlockUi.start();
    var machineList = new Array();

    this.cardOrListViewComponent.items.forEach(element => {
        if (element.pickupEveryday) {
            machineList.push(element)
        }
    });
    console.log(machineList)
    let searchBody = Object();
    searchBody.machineViews = machineList;

    this.dailyPickupAssigneeService.doExport(searchBody).subscribe((response: any) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.snackBarService.successSnackBar(response.message);
            console.log(response)
            response.list.forEach(element => {
                if (element.fileId) {
                    this.fileService.doDownload(element.fileId).subscribe((fileResponse) => {
                        CommonUtility.downloadFile(element.name, fileResponse);
                        // CommonUtility.downloadPDFFile('generate_plan_' +  Math.floor(new Date(new Date()).getTime() / 1000), response);
                    })
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                }
                
            });
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
