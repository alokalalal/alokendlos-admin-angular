import { BarcodeTemplateAddEditComponent } from './../barcode-template-add-edit/barcode-template-add-edit.component';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonResponse } from 'src/app/responses/common-response';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { ModuleConfig } from './../../../constants/module-config';
import { CustomerView } from './../../../entities/customer-view';
import { AdvanceSearchFilterConfig, ListContainer } from './../../../Interface/list-container';
import { CustomerService } from './../../../services/customer.service';
import { SharedService } from './../../../services/shared.service';
import { KeyValueView } from './../../../view/common/key-value-view';
import { BarcodeTemplateService } from 'src/app/services/barcode-template.service';
import { BarcodeTemplateView } from 'src/app/entities/barcode-template-view';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileView } from 'src/app/entities/file-view';
import CommonUtility from 'src/app/utility/common.utility';
import { FileService } from 'src/app/services/file.service';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-barcode-template-list',
    templateUrl: './barcode-template-list.component.html',
    styleUrls: ['./barcode-template-list.component.css']
})
export class BarcodeTemplateListComponent implements OnInit {
    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<BarcodeTemplateView>;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;

    public start: number = 0;
    public pageSize: number = 10;
    public recordSize!: number;
    public orderType: KeyValueView = OrderTypeEnum.DESC;
    public orderParam!: KeyValueView;
    private orderParamList: KeyValueView[] | undefined;
    private customerList: CustomerView[] | undefined;
    private activityStatusList: KeyValueView[] | undefined;
    private developmentStatusList: KeyValueView[] | undefined;
    public advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);

    public listContainer: ListContainer = {
        pageTitle: "Barcode Template",
        accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.CUSTOMER),
        hasDisplayStyleButtons: false,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: true,
        hasDisplayExportButton: true,
    };

    constructor(
        private barcodeTemplateService: BarcodeTemplateService,
        private sharedService: SharedService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private router: Router,
        private snackBarService: SnackBarService,
        private customerService: CustomerService,
        private fileService: FileService        
    ) {
    }

    async ngOnInit() {
        await this.barcodeTemplateService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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
            lable: "Search By Name / Machine Id",
            placeHolder: "Search By Barcode Template Name",
            type: 'fullTextSearch',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Barcode Template Name",
            isApplied: false
        });
        this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
        this.loadBarcodeTemplateList(this.start, this.pageSize, {});
    }

    loadBarcodeTemplateList(start: number, pageSize: number, searchBody: any) {
        this.listContainerBlockUi.start();
        this.barcodeTemplateService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<BarcodeTemplateView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.items=[];
                response.list.forEach((element: BarcodeTemplateView) => {
                    let barcodeTemplateView = new BarcodeTemplateView(element)
                    this.cardOrListViewComponent.addItem(barcodeTemplateView)
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

    view(barcodeTemplateView: BarcodeTemplateView) {
        this.router.navigate([AppUrl.BARCODE_TEMPLATE + '/' + AppUrl.VIEW_OPERATION + '/' + barcodeTemplateView.id])
    }

    edit(barcodeTemplateView: BarcodeTemplateView) {
        this.router.navigate([AppUrl.BARCODE_TEMPLATE + '/' + AppUrl.EDIT_OPERATION + '/' + barcodeTemplateView.id])
    }

  
    delete(barcodeTemplateView: BarcodeTemplateView) {
        this.barcodeTemplateService.doDelete(barcodeTemplateView).then((response: CommonResponse) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
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
            if(value.isApplied) {
                switch (key) {  
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        this.start = this.cardOrListViewComponent.start;
        this.pageSize=this.cardOrListViewComponent.pageSize;
        this.loadBarcodeTemplateList(this.start, this.pageSize, searchBody);
    }

    export() {
        let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.isApplied) {
                switch (key) {
                    default:
                        searchBody[key] = value.appliedValue;
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
        this.barcodeTemplateService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.snackBarService.successSnackBar(response.message);
                console.log(response.view.fileId)
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
        this.router.navigate(['/' + AppUrl.BARCODE_TEMPLATE + '/' + AppUrl.ADD_OPERATION]);
    }
}
