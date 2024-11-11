import { ChangeDetectorRef, Component,  Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { MaintenanceError } from 'src/app/constants/maintenance-error';
import { ErrorView } from 'src/app/entities/error-view';
import { FileView } from 'src/app/entities/file-view';
import { LocationView } from 'src/app/entities/location-view';
import { MachineView } from 'src/app/entities/machine-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileService } from 'src/app/services/file.service';
import { LocationService } from 'src/app/services/location.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import CommonUtility from 'src/app/utility/common.utility';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { CardOrListViewComponent } from '../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from '../common/card-or-list-view/enum/order-type-enum';
import { CustomerView } from 'src/app/entities/customer-view';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { ModuleConfig } from 'src/app/constants/module-config';
import { MachineService } from 'src/app/services/machine.service';
import { MachineLogService } from 'src/app/services/machine-log.service';
import { SharedService } from 'src/app/services/shared.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MachineLogView } from 'src/app/entities/machine-log-view';
@Component({
    selector: 'app-machine-log-list',
    templateUrl: './machine-log-list.component.html',
    styleUrls: ['./machine-log-list.component.css'],
})

export class MachineLogListComponent implements OnInit {
    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<MachineLogView>;
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
        pageTitle: "Bin Fullness Logs",
        accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.MACHINE_LOG),
        hasDisplayStyleButtons: false,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: true,
        hasDisplayExportButton: true,
    };

    maintenance  = MaintenanceError.maintenance;

    private locationList: LocationView[] | undefined;
    locationView = new LocationView();

    constructor(
        private machineService:MachineService,
        private fileService: FileService,
        private machineLogService: MachineLogService,
        private sharedService: SharedService,
        private router: Router,
        private snackBarService: SnackBarService,
        private customerService: CustomerService,
        private changeDetectorRef: ChangeDetectorRef,
        private locationService:LocationService

    ) {
    }

    async ngOnInit() {
        await this.machineLogService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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

        await this.machineService.doGetMachineDropdown().then((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.machineList = response.list;
            }
        });

        await this.locationService.doGetDropdown().then((response: CommonListResponse<LocationView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.locationList = response.list;
            }
        });


        let advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
        if (this.customerList != undefined && this.machineView == undefined) {
            let customerKeyValueViews: KeyValueView[] = [];
            this.customerList.forEach((customerView: CustomerView) => {
                customerKeyValueViews.push(new KeyValueView({ key: customerView.id, value: customerView.name }))
            })
            advanceSearchConfig.set("customerView", {
                lable: "Customer",
                placeHolder: "Customer",
                type: 'select',
                options: customerKeyValueViews,
                value: "",
                appliedValue: "",
                searchByLable: "Search By Customer",
                isApplied: false
            });
        }
        if (this.machineList != undefined && this.machineView == undefined) {
            let machineKeyValueViews: KeyValueView[] = [];
            this.machineList.forEach((machineView: MachineView) => {
                machineKeyValueViews.push(new KeyValueView({ key: machineView.id, value: machineView.machineId }))
            })
            advanceSearchConfig.set("machineView", {
                lable: "Machine",
                placeHolder: "Machine Id",
                type: 'select',
                options: machineKeyValueViews,
                value: "",
                appliedValue: "",
                searchByLable: "Search By Machine",
                isApplied: false
            });
        }
        if (this.locationList != undefined) {
            let locationKeyValueViews: KeyValueView[] = [];
            this.locationList.forEach((locationView: LocationView) => {
                locationKeyValueViews.push(new KeyValueView({ key: locationView.id, value: locationView.name }))
            })
        }
        /* advanceSearchConfig.set("date-range", {
            lable: "Search By start",
            placeHolder: "Search By Date",
            type: 'date-range',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Date",
            isApplied: false
        }); */
        this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
        if (this.machineView == undefined) {
            this.loadMachineLogList(this.start, this.pageSize, {});
        //   this.refreshIntervalId = setInterval(() => {
        //     this.start=0;
        //         this.loadMachineLogList(0, this.pageSize, {});
        //     }, 5000);
        } else {
            let machineView = new MachineView(this.machineView);

            let searchBody = {"startDate" : machineView.startDate, "endDate" : machineView.endDate, "machineView" : machineView};
            this.loadMachineLogList(this.start, this.pageSize, searchBody );
            //this.loadMachineLogList(this.start, this.pageSize, { machineView });


            /* let transactionView = new TransactionView();
            transactionView.machineView = this.machineView;
            if(this.machineView.startDate!=undefined && this.machineView.endDate!=undefined){
                transactionView.startDate=this.machineView.startDate;
                transactionView.endDate=this.machineView.endDate;
            }
            this.loadTransactionList(this.start, this.pageSize, transactionView, this.isFilter);


            let machineView = new MachineView(this.machineView);
            let errorView = new ErrorView();
            errorView.machineView = this.machineView;
            if(this.machineView.startDate!=undefined && this.machineView.endDate!=undefined){
                errorView.startDate=this.machineView.startDate;
                errorView.endDate=this.machineView.endDate;
            }
            let searchBody = {"startDate" : machineView.startDate, "endDate" : machineView.endDate, "machineView" : machineView};
            this.loadErrorList(this.start, this.pageSize, searchBody ); */
        }
    }
    initializeBinfullnessLogList(start: number, pageSize: number, searchBody: any) {
        this.loadMachineLogList(start, pageSize, searchBody);
    }
    loadMachineLogList(start: number, pageSize: number, searchBody: any) {
        this.machineLogService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<MachineLogView>) => {
            this.cardOrListViewComponent.items = [];
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.items=[];
                response.list.forEach((element: MachineLogView) => {
                    let machineLogView = new MachineLogView(element)
                    this.cardOrListViewComponent.addItem(machineLogView)
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
        })
    }

    view(error: ErrorView) {
        this.router.navigate([AppUrl.ERROR + '/' + AppUrl.VIEW_OPERATION + '/' + error.id])
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
                        searchBody[key] = { id: value.appliedValue };
                        break;
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
        this.orderType = this.cardOrListViewComponent.selectedOrderType;
        if (this.machineView != undefined) {
            searchBody["machineView"] = {id:this.machineView.id}
        }
        this.exportList(searchBody);
    }

    exportList(searchBody: any) {
        this.listContainerBlockUi.start();
        this.machineLogService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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

    edit(error: ErrorView) {

    }

    assign(error: ErrorView) {

    }

    delete(error: ErrorView) {

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
        if (this.machineView != undefined) {
            searchBody["machineView"] = { id: this.machineView.id }
        }
        this.loadMachineLogList(this.start, this.pageSize, searchBody);
    }

    addEventEmitCall() {

    }

    ngOnDestroy() {
        if (this.refreshIntervalId) {
            clearInterval(this.refreshIntervalId);
        }
    }
}
