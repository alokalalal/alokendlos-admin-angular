import { ChangeDetectorRef, Component,  ComponentFactoryResolver,  Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
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
import { CustomerView } from 'src/app/entities/customer-view';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { ModuleConfig } from 'src/app/constants/module-config';
import { MachineService } from 'src/app/services/machine.service';
import { SharedService } from 'src/app/services/shared.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MachineCapacityView } from 'src/app/entities/machine-capacity-view';
import { MachineCapacityService } from 'src/app/services/machine-capacity.service';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { MachineAddEditComponent } from '../../machine/machine-add-edit/machine-add-edit.component';
import { MachineCapacityAddComponent } from '../machine-capacity-add/machine-capacity-add.component';
@Component({
    selector: 'app-machine-capacity-list',
    templateUrl: './machine-capacity-list.component.html',
    styleUrls: ['./machine-capacity-list.component.css'],
})

export class MachineCapacityListComponent implements OnInit {
    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<MachineCapacityView>;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    @Input() machineView;

    public start: number = 0;
    public pageSize: number = 10;
    public recordSize!: number;
    public orderType: KeyValueView = OrderTypeEnum.DESC;
    public orderParam!: KeyValueView;
    private orderParamList: KeyValueView[] | undefined;
    private machineList: MachineView[] | undefined;
    refreshIntervalId: any;

    public listContainer: ListContainer = {
        pageTitle: "Machine Capacity",
        accessRightsJson: {
            isAccessRightAdd: false,
            isAccessRightEdit: true,
            isAccessRightDelete: false,
            isAccessRightView: false,
            isAccessRightActivation: false,
            isAccessRightList: false,
        },
        hasDisplayStyleButtons: false,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: true,
        hasDisplayExportButton: false,
    };

    maintenance  = MaintenanceError.maintenance;

    private locationList: LocationView[] | undefined;
    locationView = new LocationView();

    constructor(
        private machineService:MachineService,
        private fileService: FileService,
        private machineCapacityService: MachineCapacityService,
        private sharedService: SharedService,
        private router: Router,
        private snackBarService: SnackBarService,
        private changeDetectorRef: ChangeDetectorRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
    }

    async ngOnInit() {
        await this.machineCapacityService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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

        await this.machineService.doGetMachineDropdown().then((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.machineList = response.list;
            }
        });

        if (this.machineView == undefined) {
            this.loadMachineCapacityList(this.start, this.pageSize, {});
        //   this.refreshIntervalId = setInterval(() => {
        //     this.start=0;
        //         this.loadMachineLogList(0, this.pageSize, {});
        //     }, 5000);
        } else {
            let machineView = new MachineView(this.machineView);
            this.loadMachineCapacityList(this.start, this.pageSize, { machineView });
        }
    }

    loadMachineCapacityList(start: number, pageSize: number, searchBody: any) {
        this.machineCapacityService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<MachineCapacityView>) => {
            this.cardOrListViewComponent.items = [];
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.items=[];
                response.list.forEach((element: MachineCapacityView) => {
                    let machineCapacityView = new MachineCapacityView(element)
                    this.cardOrListViewComponent.addItem(machineCapacityView)
                    //this.listContainer.hasDisplayExportButton=true
                });
                this.recordSize = response.records
                this.start = this.start + this.pageSize;
                this.cardOrListViewComponent.start = this.start;
                this.cardOrListViewComponent.recordSize = this.recordSize;
                this.cardOrListViewComponent.pageSize = this.pageSize;
                this.cardOrListViewComponent.hasAdvanceFilter = false;
                
            } else {
                //this.listContainer.hasDisplayExportButton=false
                this.snackBarService.errorSnackBar(response.message);
            }
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
    }

    searchEventEmitCall() {
        clearInterval(this.refreshIntervalId)
        let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.isApplied) {
                switch (key) {
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
        this.loadMachineCapacityList(this.start, this.pageSize, searchBody);
    }

    addEventEmitCall() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineCapacityAddComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = this.machineView;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach();
        });
    }

    edit(machine: MachineView) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineCapacityAddComponent);
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

    ngOnDestroy() {
        if (this.refreshIntervalId) {
            clearInterval(this.refreshIntervalId);
        }
    }
}
