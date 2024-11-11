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
import { SharedService } from 'src/app/services/shared.service';
import { CustomerService } from 'src/app/services/customer.service';
import { PLCConfigurationService } from 'src/app/services/plc-configuration.service';
import { PlcConfigurationView } from 'src/app/entities/plc-configuration-view';
@Component({
    selector: 'app-plc-configuration-list',
    templateUrl: './plc-configuration-list.component.html',
    styleUrls: ['./plc-configuration-list.component.css'],
})

export class PLCConfigurationListComponent implements OnInit {
    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<PlcConfigurationView>;
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
    public listContainer: ListContainer = {
        pageTitle: "PLC Configuration Logs",
        accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.MACHINE_LOG),
        hasDisplayStyleButtons: false,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: false,
        hasDisplayExportButton: false,
    };

    maintenance  = MaintenanceError.maintenance;

    private locationList: LocationView[] | undefined;
    locationView = new LocationView();

    constructor(
        private machineService:MachineService,
        private fileService: FileService,
        private plcConfigurationService: PLCConfigurationService,
        private sharedService: SharedService,
        private router: Router,
        private snackBarService: SnackBarService,
        private customerService: CustomerService,
        private changeDetectorRef: ChangeDetectorRef,
        private locationService:LocationService

    ) {
    }

    async ngOnInit() {
        await this.plcConfigurationService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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

        if (this.machineView == undefined) {
            this.loadPlcConfigurationLogList(this.start, this.pageSize, {});
        //   this.refreshIntervalId = setInterval(() => {
        //     this.start=0;
        //         this.loadMachineLogList(0, this.pageSize, {});
        //     }, 5000);
        } else {
            let machineView = new MachineView(this.machineView);
            this.loadPlcConfigurationLogList(this.start, this.pageSize, { machineView });
        }
    }

    loadPlcConfigurationLogList(start: number, pageSize: number, searchBody: any) {
        this.plcConfigurationService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<PlcConfigurationView>) => {
            this.cardOrListViewComponent.items = [];
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.items=[];
                response.list.forEach((element: PlcConfigurationView) => {
                    let machineLogView = new PlcConfigurationView(element)
                    this.cardOrListViewComponent.addItem(machineLogView)
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
    }

    view(error: ErrorView) {
        this.router.navigate([AppUrl.ERROR + '/' + AppUrl.VIEW_OPERATION + '/' + error.id])
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
    }

    ngOnDestroy() {
        if (this.refreshIntervalId) {
            clearInterval(this.refreshIntervalId);
        }
    }
}
