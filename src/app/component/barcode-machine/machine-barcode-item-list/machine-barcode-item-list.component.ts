import { Component, OnInit, ViewChild, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CustomerView } from './../../../entities/customer-view';
import { KeyValueView } from './../../../view/common/key-value-view';
import { CardOrListViewComponent } from './../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from './../../common/card-or-list-view/enum/order-type-enum';
import { Sort } from '@angular/material/sort';
import { MachineBarcodeService } from 'src/app/services/machine-barcode.service';
import { BarcodeMachineView } from 'src/app/entities/barcode-machine-view';
import { BarcodeMachineItemView } from 'src/app/entities/barcode-machine-item-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonResponse } from 'src/app/responses/common-response';
import { MachineBarcodeAddEditComponent } from '../machine-barcode-add-edit/machine-barcode-add-edit.component';

@Component({
  selector: 'app-machine-barcode-item-list',
  templateUrl: './machine-barcode-item-list.component.html',
  styleUrls: ['./machine-barcode-item-list.component.css']
})
export class MachineBarcodeItemListComponent implements OnInit {
    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @Input() dynamicComponentData: any;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<BarcodeMachineItemView>;
  
  public start: number = 0;
  public pageSize: number = 10;
  public recordSize!: number;
  public orderType: KeyValueView = OrderTypeEnum.DESC;
  public orderParam!: KeyValueView;
  private orderParamList: KeyValueView[] | undefined;
  machibeBarcodeItemList: any;
  public BarcodeMachineItemView: BarcodeMachineItemView = new BarcodeMachineItemView();
  BARCODE_ITEM_ID: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  
  public listContainer: ListContainer = {
    pageTitle: "Barcodes",
    //accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.MACHINE_BARCODE),
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
    hasDisplayExportButton: false,
 };
    componentFactoryResolver: any;
  
  
  constructor(
      private activatedRoute: ActivatedRoute,
      public machineBarcodeService: MachineBarcodeService,
      private sharedService: SharedService,
      private router: Router,
      private snackBarService: SnackBarService
  ) 
  {
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
    let searchBody = Object();
      if (this.BARCODE_ITEM_ID == undefined) {
          this.router.navigate([AppUrl.MACHINE_BARCODE + '/' + AppUrl.LIST_OPERATION])
      } else {
        
          /* this.machineBarcodeService.doView(this.BARCODE_ITEM_ID).subscribe((response) => {
              if (response != undefined && response.code >= 1000 && response.code < 2000) {
                  this.machibeBarcodeItemList = response.view;
              } else {
                  this.snackBarService.errorSnackBar(response.message);
              }
          }) */
          searchBody['id'] = this.BARCODE_ITEM_ID;
      }

      let advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
      advanceSearchConfig.set("fullTextSearch", {
          lable: "Search By Barcode",
          placeHolder: "Search By Barcode",
          type: 'fullTextSearch',
          value: "",
          appliedValue: "",
          searchByLable: "Search By Name",
          isApplied: false
      });
      this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
      
      this.loadMachineBarcodeFileList(this.start, this.pageSize, searchBody)
  }
loadMachineBarcodeFileList(start: number, pageSize: number, searchBody: any) {
    this.listContainerBlockUi.start();
    this.machineBarcodeService.doSearchItem(start, pageSize, this.orderType?.key, this.orderParam?.key, searchBody).subscribe(async (response: CommonListResponse<BarcodeMachineItemView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.cardOrListViewComponent.items=[];
            response.list.forEach((element: BarcodeMachineItemView) => {
                let barcodeMachineItemView = new BarcodeMachineItemView(element)
                this.cardOrListViewComponent.addItem(barcodeMachineItemView)
                this.listContainer.hasDisplayExportButton=false
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


  
// addEventEmitCall() {
//     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineBarcodeAddEditComponent);
//     const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
//     componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
//         if (isReloadListData) {
//             this.cardOrListViewComponent.resetPagination()
//             this.searchEventEmitCall();
//         }
//         this.dynamicComponentContainer.detach();
//     });
// }
  

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
      searchBody.id = this.BARCODE_ITEM_ID;
      this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
          if (value.isApplied) {
              if (key == "fullTextSearch") {
                  searchBody['fullTextSearch'] = value.appliedValue
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

//     edit(BarcodeMachineItemView: BarcodeMachineView) {
//         const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineBarcodeAddEditComponent);
//           const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
//           componentRef.instance.dynamicComponentData = barcodeMachineView;
//           componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
//               if (isReloadListData) {
//                   this.cardOrListViewComponent.resetPagination()
//                   this.searchEventEmitCall();
//               }
//               this.dynamicComponentContainer.detach();
//           });
//     }
// }


//   addEventEmitCall() {
//     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineBarcodeAddEditComponent);
//     const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
//     componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
//         if (isReloadListData) {
//             this.cardOrListViewComponent.resetPagination()
//             this.searchEventEmitCall();
//         }
//         this.dynamicComponentContainer.detach();
//     });
 }




  export() {
      // let searchBody = Object();
      // this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
      //     if (value.isApplied) {
      //         if (key == "fullTextSearch") {
      //             searchBody['name'] = value.appliedValue
      //         } else {
      //             searchBody[key] = value.appliedValue
      //         }
      //     }
      // });
      // this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
      // this.orderType = this.cardOrListViewComponent.selectedOrderType;
      // this.exportList(searchBody);
  }

  exportList(searchBody: any) {
      
  }
}
