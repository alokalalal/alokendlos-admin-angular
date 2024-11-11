import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { FileView } from 'src/app/entities/file-view';
import { LocationView } from 'src/app/entities/location-view';
import { MachineView } from 'src/app/entities/machine-view';
import { TransactionView } from 'src/app/entities/transaction-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileService } from 'src/app/services/file.service';
import { LocationService } from 'src/app/services/location.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import CommonUtility from 'src/app/utility/common.utility';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { TransactionLogComponent } from '../transaction-log-list/transaction-log.component';
import { TransactionService } from '../transaction.service';
import { ModuleConfig } from './../../../constants/module-config';
import { CustomerView } from './../../../entities/customer-view';
import { AdvanceSearchFilterConfig, ListContainer } from './../../../Interface/list-container';
import { CustomerService } from './../../../services/customer.service';
import { MachineService } from './../../../services/machine.service';
import { SharedService } from './../../../services/shared.service';
import { KeyValueView } from './../../../view/common/key-value-view';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css'],
})

export class TransactionListComponent implements OnInit {
    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<TransactionView>;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    @Input() machineView;
    public start: number = 0;
    public pageSize: number = 10;
    public recordSize!: number;
    public orderType: KeyValueView = OrderTypeEnum.DESC;
    public orderParam!: KeyValueView;
    private orderParamList: KeyValueView[] | undefined;
    private customerList: CustomerView[] | undefined;
    private machineList: MachineView[] | undefined;
    refreshIntervalId: any;
    public isFilter:any = true;
    public listContainer: ListContainer = {
        pageTitle: "Transaction",
        accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.TRANSACTION),
        hasDisplayStyleButtons: false,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: true,
        hasDisplayExportButton: true,
    };

    private locationList: LocationView[] | undefined;
    locationView = new LocationView();
    
    advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
    customerKeyValueViews: KeyValueView[] = [];
    private locationKeyValueViews: KeyValueView[] = [];
    machineKeyValueViews: KeyValueView[] = [];
    customerOptions: any;

    constructor(
        private transactionService: TransactionService,
        private fileService: FileService,
        private machineService: MachineService,
        private sharedService: SharedService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private router: Router,
        private snackBarService: SnackBarService,
        private customerService: CustomerService,
        private changeDetectorRef: ChangeDetectorRef,
        private locationService:LocationService,
        private eventEmitterService: EventEmitterService

    ) {
    }

    async ngOnInit() {        
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
        await this.transactionService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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

        this.advanceSearchConfig.set("fullTextSearch", {
            lable: "Search By Voucher Barcode",
            placeHolder: "Search Voucher Barcode",
            type: 'fullTextSearch',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Voucher Barcode",
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
        if (this.machineView== undefined) {
            this.loadTransactionList(this.start, this.pageSize, {}, this.isFilter);
            this.refreshIntervalId = setInterval(() => {
                this.start=0
                this.loadTransactionList(0, this.pageSize, {}, this.isFilter);
            }, 10000);
        } else {
            let transactionView = new TransactionView();
            transactionView.machineView = this.machineView;
            if(this.machineView.startDate!=undefined && this.machineView.endDate!=undefined){
                transactionView.startDate=this.machineView.startDate;
                transactionView.endDate=this.machineView.endDate;
            }
            this.loadTransactionList(this.start, this.pageSize, transactionView, this.isFilter);
        }
    }

    loadTransactionList(start: number, pageSize: number, searchBody: any, advanceFilter:any) {
         this.listContainerBlockUi.start();
        this.transactionService.doSearch(start, pageSize, this.orderType?.key, this.orderParam?.key, searchBody).subscribe((response: CommonListResponse<TransactionView>) => {
            this.cardOrListViewComponent.items = [];
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                // Sort the transactions based on the dateEnd field in descending order
                response.list.sort((a: TransactionView, b: TransactionView) => b.dateEnd - a.dateEnd);
                response.list.forEach((element: TransactionView) => {
                    let transactionView = new TransactionView(element)
                    this.cardOrListViewComponent.addItem(transactionView)
                    this.listContainer.hasDisplayExportButton=true
                });
                this.recordSize = response.records
                this.start = this.start + this.pageSize;
                this.cardOrListViewComponent.start = this.start;
                this.cardOrListViewComponent.recordSize = this.recordSize;
                this.cardOrListViewComponent.pageSize = this.pageSize;
                if(this.start != 30)
                {
                    clearInterval(this.refreshIntervalId)
                }
                this.changeDetectorRef.detectChanges();
            } else {
                this.listContainer.hasDisplayExportButton=false
            }
            this.isFilter = advanceFilter;
            this.cardOrListViewComponent.hasAdvanceFilter = this.isFilter;
             this.listContainerBlockUi.stop();
        })
    }

    view(transaction: TransactionView) {
        this.router.navigate([AppUrl.TRANSACTION + '/' + AppUrl.VIEW_OPERATION + '/' + transaction.id])
    }

    export() {
        let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.isApplied) {
                switch (key) {
                    case "locationView":
                    case "customerView":
                    case "TransactionView":
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
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        // this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
        // this.orderType = this.cardOrListViewComponent.selectedOrderType;
        if(this.machineView!=undefined)
        {
            searchBody["machineView"] = {id:this.machineView.id}
        }
        this.exportList(searchBody);
    }

    exportList(searchBody: any) {
        if(!this.isFilter) {
            searchBody.startDate = this.machineView.startDate;
            searchBody.endDate = this.machineView.endDate;
        }
        //this.listContainerBlockUi.start();
        this.transactionService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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
        if ((searchBody.startDate != null || searchBody.startDate != undefined) && (searchBody.endDate != null || searchBody.endDate != undefined))
           this.snackBarService.successSnackBar("Export process has started. Please wait for the file to be generated.");
    }

    edit(transaction: TransactionView) {

    }

    assign(transaction: TransactionView) {

    }

    delete(transaction: TransactionView) {

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
        clearInterval(this.refreshIntervalId)
        let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.isApplied) {
                switch (key) {
                    case "locationView":
                    case "customerView":
                    case "transactionView":
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
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        this.start = this.cardOrListViewComponent.start;
        this.pageSize=this.cardOrListViewComponent.pageSize;

        if(this.machineView!=undefined)
        {
            searchBody["machineView"] = {id:this.machineView.id}
        }
        this.loadTransactionList(this.start, this.pageSize, searchBody, true);
    }

    addEventEmitCall() {

    }

    editLocation(transactionView: TransactionView) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TransactionLogComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = transactionView;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach();
        });
    }
    ngOnDestroy() {
        if (this.refreshIntervalId) {
            clearInterval(this.refreshIntervalId);
        }
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
