import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { FileView } from 'src/app/entities/file-view';
import { Sort } from '@angular/material/sort';
import { CardOrListViewComponent } from 'src/app/component/common/card-or-list-view/card-or-list-view.component';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { OrderTypeEnum } from 'src/app/component/common/card-or-list-view/enum/order-type-enum';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonResponse } from 'src/app/responses/common-response';
import { FileService } from 'src/app/services/file.service';
import CommonUtility from 'src/app/utility/common.utility';
import { SystemSpecificationDetailAddComponent } from '../system-specification-detail-add/system-specification-detail-add.component';
import { SystemSpecificationDetailView } from 'src/app/entities/system-specification-detail-view';
import { SystemSpecificationDetailService } from 'src/app/services/system-specification-detail.service';

@Component({
  selector: 'app-system-specification-detail-list',
  templateUrl: './system-specification-detail-list.component.html',
  styleUrls: ['./system-specification-detail-list.component.css']
})
export class SystemSpecificationDetailListComponent implements OnInit {
    
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<SystemSpecificationDetailView>;
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
  systemSpecificationDetailModel: SystemSpecificationDetailView = new SystemSpecificationDetailView();
  locationId:number;
  public location_count: number = 3;
  
  public listContainer: ListContainer = {
      pageTitle: "System Specification Detail",
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
      hasDisplayExportButton: true,
  }
  
  
  constructor(
      private sharedService: SharedService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private snackBarService: SnackBarService,
      private fileService: FileService,
      private SystemSpecificationDetailService: SystemSpecificationDetailService
  ) {
      this.listContainer.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.PICKUP_ROUTE);
  }

  async ngOnInit() {
      await this.SystemSpecificationDetailService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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
          lable: "Search By Machine Id",
          placeHolder: "Search By Machine Id",
          type: 'fullTextSearch',
          value: "",
          appliedValue: "",
          searchByLable: "Search By Machine Id",
          isApplied: false
      });
      this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
      this.loadSystemSpecificationDetailList(this.start, this.pageSize, {})
  }
  
  loadSystemSpecificationDetailList(start: number, pageSize: number, searchBody: any) {
      this.listContainerBlockUi.start();
      this.SystemSpecificationDetailService.doSearch(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<SystemSpecificationDetailView>) => {
          if (response != undefined && response.code >= 1000 && response.code < 2000) {
              this.cardOrListViewComponent.items=[];
              response.list.forEach((element: SystemSpecificationDetailView) => {
                  let systemSpecificationDetailView = new SystemSpecificationDetailView(element)
                  this.cardOrListViewComponent.addItem(systemSpecificationDetailView)
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

  edit(systemSpecificationDetailView: SystemSpecificationDetailView) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SystemSpecificationDetailAddComponent);
      const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
      componentRef.instance.dynamicComponentData = systemSpecificationDetailView;
      componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
          if (isReloadListData) {
              this.cardOrListViewComponent.resetPagination()
              this.searchEventEmitCall();
          }
          this.dynamicComponentContainer.detach();
      });
  }

  delete(systemSpecificationDetailView: SystemSpecificationDetailView) {
      this.SystemSpecificationDetailService.doDelete(systemSpecificationDetailView).then((response: CommonResponse) => {
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
          if (value.isApplied) {
              if (key == "fullTextSearch") {
                searchBody['machineView']  = { 'machineId': value.appliedValue };
              } else {
                  searchBody[key] = value.appliedValue
              }
          }
      });
      this.start = this.cardOrListViewComponent.start;
      this.pageSize=this.cardOrListViewComponent.pageSize;
      this.loadSystemSpecificationDetailList(this.start, this.pageSize, searchBody);
  }

  addEventEmitCall() {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SystemSpecificationDetailAddComponent);
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
                searchBody['machineView']  = { 'machineId': value.appliedValue };
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
      this.SystemSpecificationDetailService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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

  closePickupRouteModal() {
      this.isOpenLocationContent = false;
      this.dynamicComponentContainer.detach();
  }   
}
