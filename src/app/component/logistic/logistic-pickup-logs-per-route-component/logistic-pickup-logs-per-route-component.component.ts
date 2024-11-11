import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { Sort } from '@angular/material/sort';
import { CardOrListViewComponent } from 'src/app/component/common/card-or-list-view/card-or-list-view.component';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { OrderTypeEnum } from 'src/app/component/common/card-or-list-view/enum/order-type-enum';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { PickupRouteService } from 'src/app/services/pickup-route.service';
import { PickupRouteView } from 'src/app/entities/pickup-route-view';
import { LogisticCurrentFullnessLogView } from 'src/app/entities/logistic-current-fullness-log-view';
import CommonUtility from 'src/app/utility/common.utility';
import { FileService } from 'src/app/services/file.service';
import { FileView } from 'src/app/entities/file-view';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { MachineView } from 'src/app/entities/machine-view';

@Component({
  selector: 'app-logistic-pickup-logs-per-route-component',
  templateUrl: './logistic-pickup-logs-per-route-component.component.html',
  styleUrls: ['./logistic-pickup-logs-per-route-component.component.css']
})
export class LogisticPickupLogsPerRouteComponentComponent implements OnInit {
    
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<LogisticCurrentFullnessLogView>;
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
  logisticCurrentFullnessLogModel: LogisticCurrentFullnessLogView = new LogisticCurrentFullnessLogView();
  locationId:number;
  public location_count: number = 3;

  private pickupRouteList: MachineView[] | undefined;
  pickupRouteValueViews: KeyValueView[] = [];
  
  public listContainer: ListContainer = {
      pageTitle: "Pickup Logs per Route",
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
      public pickupRouteService: PickupRouteService,
      private snackBarService: SnackBarService,
      private fileService: FileService
  ) {}

  async ngOnInit() {
      await this.pickupRouteService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
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
          lable: "Search By Pickup Route Name",
          placeHolder: "Search By Pickup Route",
          type: 'fullTextSearch',
          value: "",
          appliedValue: "",
          searchByLable: "Search By Pickup Route Name",
          isApplied: false
      });
      
      this.pickupRouteService.doGetPickupRouteDropdown().then((response: CommonListResponse<PickupRouteView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.pickupRouteList = response.list;
                this.pickupRouteList.forEach((pickupRouteView: PickupRouteView) => {
                    this.pickupRouteValueViews.push(new KeyValueView({ key: pickupRouteView.id, value: pickupRouteView.name }))
                })
                advanceSearchConfig.set("pickupRouteView", {
                    lable: "Pickroute",
                    placeHolder: "Pickup Route Name",
                    type: 'select',
                    options: this.pickupRouteValueViews,
                    value: "",
                    appliedValue: "",
                    searchByLable: "Search By Pickup Route Name",
                    isApplied: false
                });
        }
    });
    advanceSearchConfig.set("date-range", {
        lable: "Search By start",
        placeHolder: "Search By Date",
        type: 'date-range',
        value: "",
        appliedValue: "",
        searchByLable: "Search By Date",
        isApplied: false
    });

    this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
      this.loadPickupRouteList(this.start, this.pageSize, {})
  }
  
  loadPickupRouteList(start: number, pageSize: number, searchBody: any) {
    this.listContainerBlockUi.start();
    this.pickupRouteService.getLogisticPickupLogsPerRoute(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<LogisticCurrentFullnessLogView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.cardOrListViewComponent.items=[];
            response.list.forEach((element: LogisticCurrentFullnessLogView) => {
                let logisticCurrentFullnessLogView = new LogisticCurrentFullnessLogView(element)
                this.cardOrListViewComponent.addItem(logisticCurrentFullnessLogView)
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
            switch (key) {
                case "pickupRouteView":                    
                    searchBody["fullTextSearch"]  = value.value["value"];
                    break;
                case "date-range":
                    let appliedValue: KeyValueView[] = value.appliedValue as KeyValueView[];
                    searchBody['startDate'] = appliedValue.find((d: KeyValueView) => d.key === 'start')?.value;
                    searchBody['endDate'] = appliedValue.find((d: KeyValueView) => d.key === 'end')?.value;
                    break                
                default:
                    searchBody[key] = value.appliedValue;
                    break;
            }
        }

      });
      this.start = this.cardOrListViewComponent.start;
      this.pageSize=this.cardOrListViewComponent.pageSize;
      this.loadPickupRouteList(this.start, this.pageSize, searchBody);
  }

  export() {
      let searchBody = Object();
      this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
        if (value.isApplied) {
            switch (key) {
                case "pickupRouteView":                    
                    searchBody["fullTextSearch"]  = value.value["value"];
                    break;
                case "date-range":
                    let appliedValue: KeyValueView[] = value.appliedValue as KeyValueView[];
                    searchBody['startDate'] = appliedValue.find((d: KeyValueView) => d.key === 'start')?.value;
                    searchBody['endDate'] = appliedValue.find((d: KeyValueView) => d.key === 'end')?.value;
                    break                
                default:
                    searchBody[key] = value.appliedValue;
                    break;
            }
            /* if (key == "fullTextSearch") {
                searchBody['fullTextSearch'] = value.appliedValue
            } else {
                searchBody[key] = value.appliedValue
            } */
        }
      });
      //this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
      //this.orderType = this.cardOrListViewComponent.selectedOrderType;
      this.exportList(searchBody);
  }

  exportList(searchBody: any) {
      this.listContainerBlockUi.start();
      this.pickupRouteService.doExportPickupLogsperRoute(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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
