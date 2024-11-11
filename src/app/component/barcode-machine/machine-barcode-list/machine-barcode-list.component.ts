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
import { KeyValueView } from './../../../view/common/key-value-view';
import { CardOrListViewComponent } from './../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from './../../common/card-or-list-view/enum/order-type-enum';
import { FileService } from 'src/app/services/file.service';
import { Sort } from '@angular/material/sort';
import { MachineBarcodeAddEditComponent } from '../machine-barcode-add-edit/machine-barcode-add-edit.component';
import { MachineBarcodeService } from 'src/app/services/machine-barcode.service';
import { BarcodeMachineView } from 'src/app/entities/barcode-machine-view';
import CommonUtility from 'src/app/utility/common.utility';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileView } from 'src/app/entities/file-view';

@Component({
  selector: 'app-machine-barcode-list',
  templateUrl: './machine-barcode-list.component.html',
  styleUrls: ['./machine-barcode-list.component.css']
})
export class MachineBarcodeListComponent implements OnInit {

    
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<BarcodeMachineView>;
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
      pageTitle: "Machine Barcode Files",
      accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.MACHINE_BARCODE),
      hasDisplayStyleButtons: false,
      defaultDisplayStyle: 'list',
      hasDisplayStylePagination: true,
      hasDisplayExportButton: false,
  }
  
  
  constructor(
      
      public machineBarcodeService: MachineBarcodeService,
      private sharedService: SharedService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private router: Router,
      private snackBarService: SnackBarService,
      private fileService: FileService,
  ) {
      this.listContainer.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.MACHINE_BARCODE);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
      await this.machineBarcodeService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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
          lable: "Search By File Name",
          placeHolder: "Search By File Name",
          type: 'fullTextSearch',
          value: "",
          appliedValue: "",
          searchByLable: "Search By Name",
          isApplied: false
      });
      this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
      this.loadMachineBarcodeFileList(this.start, this.pageSize, {})
  }
  
  loadMachineBarcodeFileList(start: number, pageSize: number, searchBody: any) {
      this.listContainerBlockUi.start();
      this.machineBarcodeService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<BarcodeMachineView>) => {
          if (response != undefined && response.code >= 1000 && response.code < 2000) {
            
              this.cardOrListViewComponent.items=[];
              response.list.forEach((element: BarcodeMachineView) => {
                  //if(element.fileView?.name != undefined) {
                      let barcodeMachineView = new BarcodeMachineView(element)
                      this.cardOrListViewComponent.addItem(barcodeMachineView)
                //}
              });
              this.recordSize = response.records
              this.start = this.start + this.pageSize;
              this.cardOrListViewComponent.start = this.start;
              this.cardOrListViewComponent.recordSize = this.recordSize;
              this.cardOrListViewComponent.pageSize = this.pageSize;
          } else {
              this.snackBarService.errorSnackBar(response.message);
          }
          this.listContainerBlockUi.stop();
      });
  }

  getCommonEventEmitterFunction(object: { data: any, actionName: string }) {
      if (object.actionName == "edit") {
          //this.edit(object?.data);
      }
  }


  /* edit(barcodeMachineView: BarcodeMachineView) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineBarcodeAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = barcodeMachineView;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.cardOrListViewComponent.resetPagination()
                this.searchEventEmitCall();
            }
            this.dynamicComponentContainer.detach();
        });
  } */

  view(barcodeMachineView: BarcodeMachineView) {
    this.router.navigate([AppUrl.MACHINE_BARCODE + '/' + AppUrl.VIEW_OPERATION + '/' + barcodeMachineView.id])
}

  delete(barcodeMachineView: BarcodeMachineView) {
    this.machineBarcodeService.doDelete(barcodeMachineView).then((response: CommonResponse) => {
          if (response != undefined && response.code >= 1000 && response.code < 2000) {       
            this.router.navigate([AppUrl.MACHINE_BARCODE + '/' + AppUrl.LIST_OPERATION ])
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
          if (value.isApplied) {
              if (key == "fullTextSearch") {
                  searchBody['barcodeFileName'] = value.appliedValue
              } else {
                  searchBody[key] = value.appliedValue
              }
          }

      });
      this.start = this.cardOrListViewComponent.start;
      this.pageSize=this.cardOrListViewComponent.pageSize;
      this.loadMachineBarcodeFileList(this.start, this.pageSize, searchBody);
  }

  activeInactiveRowData(customer: CustomerView) {
      this.machineBarcodeService.doActiveInactive(customer).then((response: CommonResponse) => {
          if(response != undefined && response.code >= 1000 && response.code < 2000) {
              this.cardOrListViewComponent.resetPagination()
              this.searchEventEmitCall();
          }
      });
  }

  addEventEmitCall() {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineBarcodeAddEditComponent);
      const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
      componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
          if (isReloadListData) {
              this.cardOrListViewComponent.resetPagination()
              this.searchEventEmitCall();
          }
          this.dynamicComponentContainer.detach();
      });
  }

  export(barcodeMachineView: BarcodeMachineView) {
      this.exportList(barcodeMachineView.id);
  }

  exportList(id:any) {
      //this.listContainerBlockUi.start();
      this.machineBarcodeService.doExport(id).subscribe((response: CommonViewResponse<FileView>) => {
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
      })
      this.snackBarService.successSnackBar("Export process has started. Please wait for the file to be generated.");
  }

  closeCustomerModal() {
      this.isOpenLocationContent = false;
      this.dynamicComponentContainer.detach();
  } 
}
