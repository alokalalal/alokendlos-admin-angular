import { CommonResponse } from './../../../responses/common-response';
import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CustomerView } from './../../../entities/customer-view';
import { CommonListResponse } from './../../../responses/common-list-response';
import { KeyValueView } from './../../../view/common/key-value-view';
import { CardOrListViewComponent } from './../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from './../../common/card-or-list-view/enum/order-type-enum';
import { CustomerLocationAddEditComponent } from '../../customer-location/customer-location-add-edit/customer-location-add-edit.component';
import { LocationView } from 'src/app/entities/location-view';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileView } from 'src/app/entities/file-view';
import CommonUtility from 'src/app/utility/common.utility';
import { FileService } from 'src/app/services/file.service';
import { UserView } from 'src/app/view/common/user-view';
import { UserService } from 'src/app/services/user.service';
import { UserAddEditComponent } from '../user-add-edit/user-add-edit.component';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<UserView>;
    @Input() customerView: any;

    appUrl = AppUrl;
    apiurl = Apiurl;
    apiUrlParameter = ApiUrlParameter;
    public start: number = 0;
    public pageSize: number = 10;
    public recordSize!: number;
    public orderType: KeyValueView = OrderTypeEnum.DESC;
    public orderParam!: KeyValueView;
    private orderParamList: KeyValueView[] | undefined;
    private customerList: CustomerView[] | undefined;
    refreshIntervalId: any;


    public listContainer: ListContainer = {
        pageTitle: "User",
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
        public userService: UserService,
        private sharedService: SharedService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private router: Router,
        private snackBarService: SnackBarService,
        private fileService: FileService
    ) {
        this.listContainer.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.USER);
       
    }

    async ngOnInit() {
         if(this.customerView!=undefined){
            this.listContainer.accessRightsJson.isAccessRightAdd= false;
            this.listContainer.hasDisplayStyleButtons= false;
        }

        await this.userService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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

        let advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
        advanceSearchConfig.set("fullTextSearch", {
            lable: "Search By Name",
            placeHolder: "Search By Name",
            type: 'fullTextSearch',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Name",
            isApplied: false
        });
        

        /*advanceSearchConfig.set("active", {
            lable: "Activation Status",
            placeHolder: "Activation Status",
            type: 'select',
            options: [
                { key: "true", value: "Active" },
                { key: "false", value: "In Active" },
            ],
            value: "",
            appliedValue: "",
            searchByLable: "Search By Activation Status",
            isApplied: false
        });*/
    
        this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
        if (this.customerView== undefined) {
            this.loadUserList(this.start, this.pageSize, {});
        } else {
            let customerView = new CustomerView(this.customerView)
            this.loadUserList(this.start, this.pageSize, { customerView });
        }
    }

    loadUserList(start: number, pageSize: number, searchBody: any) {
        this.listContainerBlockUi.start();
        this.userService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<UserView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.items=[];
                console.log(response.list);
                response.list.forEach((element: UserView) => {
                    let userView = new UserView(element)
                    this.cardOrListViewComponent.addItem(userView)
                    this.listContainer.hasDisplayExportButton=true
                });
                this.recordSize = response.records
                this.start = this.start + this.pageSize;
                this.cardOrListViewComponent.start = this.start;
                this.cardOrListViewComponent.recordSize = this.recordSize;
                this.cardOrListViewComponent.pageSize = this.pageSize;
                this.cardOrListViewComponent.isNoDataFound=false
            } else {
                this.listContainer.hasDisplayExportButton=false
                this.cardOrListViewComponent.isNoDataFound=true
            }
            this.listContainerBlockUi.stop();
        })
    }

    getCommonEventEmitterFunction(object: { data: any, actionName: string }) {
        if (object.actionName == "edit") {
            this.edit(object?.data);
        }
    }

    edit(user: UserView) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = user;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach();
        });
    }

    view(user: UserView) {
        this.router.navigate([AppUrl.USER + '/' + AppUrl.VIEW_OPERATION + '/' + user.id])
    }

    delete(user: UserView) {
        this.userService.doDelete(user).then((response: CommonResponse) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000 || response.code == 2367) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
        });
    }

    addLocation(userView: UserView) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomerLocationAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        let locationView = new LocationView();
        locationView.customerView = userView;
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
                    searchBody["fullTextSearch"] = value.appliedValue
                } else{
                    searchBody[key] = value.appliedValue
                }
            }

        });
        this.start = this.cardOrListViewComponent.start;
        this.pageSize=this.cardOrListViewComponent.pageSize;
        if (this.customerView== undefined) {
            this.loadUserList(this.start, this.pageSize, searchBody);    
        } else {
            let customerView = new CustomerView(this.customerView)
            searchBody.customerView= customerView;
            this.loadUserList(this.start, this.pageSize, searchBody );
        }
    }

    activeInactiveRowData(user: UserView) {
        this.userService.doActiveInactive(user).then((response: CommonResponse) => {
            this.cardOrListViewComponent.resetPagination()
            this.searchEventEmitCall();
        });
    }

    addEventEmitCall() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserAddEditComponent);
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
                    case "fullTextSearch":
                        searchBody['name'] = value.appliedValue;
                    break;
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        // this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
        // this.orderType = this.cardOrListViewComponent.selectedOrderType;
        if(this.customerView!=undefined)
        {
            searchBody["customerView"] = {id:this.customerView.id}
        }
        console.log(this.orderType)
        console.log(this.orderParam)
        this.exportList(searchBody);
    }

    exportList(searchBody: any) {
        this.listContainerBlockUi.start();
        this.userService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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
}
