import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomerView } from 'src/app/entities/customer-view';
import { FileView } from 'src/app/entities/file-view';
import { LocationView } from 'src/app/entities/location-view';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { CustomerLocationService } from 'src/app/services/customer-location.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FileService } from 'src/app/services/file.service';
import { LocationService } from 'src/app/services/location.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import CommonUtility from 'src/app/utility/common.utility';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { CustomerLocationAddEditComponent } from '../customer-location-add-edit/customer-location-add-edit.component';
import { MachineView } from 'src/app/entities/machine-view';
import { CommonResponse } from 'src/app/responses/common-response';

@Component({
    selector: 'app-customer-location-list',
    templateUrl: './customer-location-list.component.html',
    styleUrls: ['./customer-location-list.component.css']
})
export class CustomerLocationListComponent implements OnInit {

    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<LocationView>;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;

    public customerId : number;
    public locationView: LocationView = new LocationView();
    public customerView: CustomerView = new CustomerView();
    private customerLocationList: LocationView[] | undefined;
    mode: ProgressSpinnerMode = 'determinate';
    public start: number = 0;
    public pageSize: number = 10;
    public recordSize!: number;
    public orderType: KeyValueView = OrderTypeEnum.DESC;
    public orderParam!: KeyValueView;
    private orderParamList: KeyValueView[] | undefined;
    countrylist: KeyValueView[] = [];

    public listContainer: ListContainer = {
        pageTitle: "Branch Details",
        accessRightsJson: {
            isAccessRightAdd: true,
            isAccessRightEdit: false,
            isAccessRightDelete: true,
            isAccessRightView: true,
            isAccessRightActivation: false,
            isAccessRightList: false,
        },
        hasDisplayStyleButtons: false,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: true,
        hasDisplayExportButton: true,
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private customerLocationService: CustomerLocationService,
        private locationService: LocationService,
        private customerService: CustomerService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private snackBarService: SnackBarService,
        private fileService: FileService
    ) {
        this.customerId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    }

    async ngOnInit() {
        await this.customerService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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
        let advanceSearchConfig : Map<string, AdvanceSearchFilterConfig> = new Map([]);
        advanceSearchConfig.set("fullTextSearch",{
            lable: "Search By Name",
            placeHolder: "Search By Name",
            type: 'fullTextSearch',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Name",
            isApplied: false
        });
        this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
        this.loadCustomerLocationList(this.start, this.pageSize, {})
    }

    loadCustomerLocationList(start: number, pageSize: number, searchBody: any) {
        this.listContainerBlockUi.start();
        searchBody.customerView = this.customerView;
        searchBody.customerView.id = this.customerId;
        this.customerLocationService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<LocationView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {

                this.cardOrListViewComponent.items=[];
                response.list.forEach((element: LocationView) => {
                    let machineView = element.machineView;
                    let locationView = new LocationView(element)
                    locationView.machineView = machineView;
                    this.cardOrListViewComponent.addItem(locationView)
                });
                this.recordSize = response.records
                this.start = this.start + this.pageSize;
                this.cardOrListViewComponent.start = this.start;
                this.cardOrListViewComponent.recordSize = this.recordSize;
                this.cardOrListViewComponent.pageSize = this.pageSize;
                this.cardOrListViewComponent.isNoDataFound=false
                this.listContainer.hasDisplayExportButton=true
            }else{
                this.listContainer.hasDisplayExportButton=false
                this.cardOrListViewComponent.isNoDataFound=true
            }
            this.listContainerBlockUi.stop();
        })
    }

    export() {
        let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.isApplied) {
                switch (key) {
                    case "fullTextSearch":
                        searchBody['name'] = value.appliedValue;
                    break;
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
        this.orderType = this.cardOrListViewComponent.selectedOrderType;
        searchBody.customerView = this.customerView;
        searchBody.customerView.id = this.customerId;
        this.exportList(searchBody);
    }

    exportList(searchBody: any) {
        this.listContainerBlockUi.start();
        this.locationService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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


    addEventEmitCall() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomerLocationAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        let locationView = new LocationView();
        locationView.customerView = new CustomerView();
        locationView.customerView.id = this.customerId;
        componentRef.instance.dynamicComponentData = locationView;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach();
        });
    }

    /* editLocation(customerLocation: LocationView, allEditable:any) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomerLocationAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = customerLocation;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach(); 
        });
    } */

    editLocation(customerLocation: LocationView, additionalData: any) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomerLocationAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = customerLocation;
        componentRef.instance.additionalData = additionalData; // Pass additional data as input property
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination();
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach(); 
        });
    }

    searchEventEmitCall() {
        let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
        if (value.isApplied) {
        switch (key) {
                case "fullTextSearch":
                    searchBody['name'] = value.appliedValue;
                    break;
                default: 
                    searchBody[key] = { id: value.appliedValue }
                    break;
            }
        }
        });
        this.start = this.cardOrListViewComponent.start;
        this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
        this.orderType = this.cardOrListViewComponent.selectedOrderType;
        this.pageSize=this.cardOrListViewComponent.pageSize;
        this.loadCustomerLocationList(this.start, this.pageSize, searchBody);
    }
    delete(customerLocation: LocationView) {
        this.customerLocationService.doDelete(customerLocation).then((response: CommonResponse) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000 || response.code == 2373) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
        });
    }
} 
