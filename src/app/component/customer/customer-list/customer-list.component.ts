import { CommonResponse } from './../../../responses/common-response';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CustomerView } from './../../../entities/customer-view';
import { CommonListResponse } from './../../../responses/common-list-response';
import { CustomerService } from './../../../services/customer.service';
import { KeyValueView } from './../../../view/common/key-value-view';
import { CardOrListViewComponent } from './../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from './../../common/card-or-list-view/enum/order-type-enum';
import { CustomerAddEditComponent } from './../customer-add-edit/customer-add-edit.component';
import { CustomerLocationAddEditComponent } from '../../customer-location/customer-location-add-edit/customer-location-add-edit.component';
import { LocationView } from 'src/app/entities/location-view';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileView } from 'src/app/entities/file-view';
import CommonUtility from 'src/app/utility/common.utility';
import { FileService } from 'src/app/services/file.service';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
    
    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<CustomerView>;
    location=["dilip", "dilip2","dilip3"] ;
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
    customerModel: CustomerView = new CustomerView();
    locationId:number;
    public location_count: number = 3;
    
    public listContainer: ListContainer = {
        pageTitle: "Customer",
        accessRightsJson: {
            isAccessRightAdd: false,
            isAccessRightEdit: false,
            isAccessRightDelete: false,
            isAccessRightView: false,
            isAccessRightActivation: false,
            isAccessRightList: false,
        },
        hasDisplayStyleButtons: true,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: true,
        hasDisplayExportButton: true,
    }
    
    
    constructor(
        public customerService: CustomerService,
        private sharedService: SharedService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private router: Router,
        private snackBarService: SnackBarService,
        private fileService: FileService
    ) {
        this.listContainer.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.CUSTOMER);
    }

    async ngOnInit() {
        await this.customerService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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
            lable: "Search By Name",
            placeHolder: "Search By Customer Name",
            type: 'fullTextSearch',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Name",
            isApplied: false
        });
        this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
        this.loadCustomerList(this.start, this.pageSize, {})
    }
    
    loadCustomerList(start: number, pageSize: number, searchBody: any) {
        this.listContainerBlockUi.start();
        this.customerService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.items=[];
                response.list.forEach((element: CustomerView) => {
                    let customerView = new CustomerView(element)
                    this.cardOrListViewComponent.addItem(customerView)
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

    getCommonEventEmitterFunction(object: { data: any, actionName: string }) {
        if (object.actionName == "edit") {
            this.edit(object?.data);
        }
    }

    viewLocation(id:number){
        this.locationId=id;
        this.isOpenLocationContent = true; 
        
    }

    edit(customer: CustomerView) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomerAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = customer;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach();
        });
    }

    view(customer: CustomerView) {
        this.router.navigate([AppUrl.CUSTOMER + '/' + AppUrl.VIEW_OPERATION + '/' + customer.id])
    }

    delete(customer: CustomerView) {
        this.customerService.doDelete(customer).then((response: CommonResponse) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
        });
    }

    addLocation(customerView: CustomerView) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomerLocationAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        let locationView = new LocationView();
        locationView.customerView = customerView;
        componentRef.instance.dynamicComponentData = locationView;
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
                if (key == "fullTextSearch") {
                    searchBody['name'] = value.appliedValue
                } else {
                    searchBody[key] = value.appliedValue
                }
            }

        });
        this.start = this.cardOrListViewComponent.start;
        this.pageSize=this.cardOrListViewComponent.pageSize;
        this.loadCustomerList(this.start, this.pageSize, searchBody);
    }

    activeInactiveRowData(customer: CustomerView) {
        this.customerService.doActiveInactive(customer).then((response: CommonResponse) => {
            if(response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
        });
    }

    addEventEmitCall() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomerAddEditComponent);
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
                if (key == "fullTextSearch") {
                    searchBody['name'] = value.appliedValue
                } else {
                    searchBody[key] = value.appliedValue
                }
            }
        });
        //this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
        //this.orderType = this.cardOrListViewComponent.selectedOrderType;
        this.exportList(searchBody);
    }

    exportList(searchBody: any) {
        this.listContainerBlockUi.start();
        this.customerService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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

    closeCustomerModal() {
        this.isOpenLocationContent = false;
        this.dynamicComponentContainer.detach();
    }   
}
