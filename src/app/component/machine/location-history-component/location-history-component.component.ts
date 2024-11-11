import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { ChangeLocationService } from '../../change-location/change-location.service';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { ChangeLocationView } from 'src/app/entities/change-location-view';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { SharedService } from 'src/app/services/shared.service';
import { ModuleConfig } from 'src/app/constants/module-config';
import { CustomerService } from 'src/app/services/customer.service';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CustomerView } from 'src/app/entities/customer-view';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MachineView } from 'src/app/entities/machine-view';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-location-history-component',
  templateUrl: './location-history-component.component.html',
  styleUrls: ['./location-history-component.component.css']
})
export class LocationHistoryComponentComponent implements OnInit {
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<ChangeLocationView>;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  @Input() machineView;

  public start: number = 0;
  public pageSize: number = 10;
  public recordSize!: number;
  public orderParam!: KeyValueView;
  private orderParamList: KeyValueView[] | undefined;
  public orderType: KeyValueView = OrderTypeEnum.DESC;
  id: KeyValueView;
  approve: KeyValueView;
  customerList: CustomerView[];
  advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);

  public listContainer: ListContainer = {
    pageTitle: "Location History",
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

  constructor(private changeLocationService: ChangeLocationService,  private sharedService: SharedService, private customerService: CustomerService, private snackBarService: SnackBarService) { }

  async ngOnInit(): Promise<void> {
    
    await this.changeLocationService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
          this.orderParam = response.list[5];
          this.orderParamList = response.list;
      }
  });
  if (this.orderParamList != undefined) {
      this.listContainer.listOrderConfig = {
          parameterList: this.orderParamList,
          defaultSelectedParameter: this.orderParamList[5],
          defaultSelectedOrderType: this.orderType
      }
  }
  await this.customerService.doGetCustomerDropdown().then((response: CommonListResponse<CustomerView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
          this.customerList = response.list;
      }
  });

  if (this.machineView == undefined) {
    this.loadChangeLocationList(this.start, this.pageSize, {});
} else {
    let machineView = new MachineView(this.machineView);
    let searchBody = {"startDate" : machineView.startDate, "endDate" : machineView.endDate, "machineView" : machineView};
    this.loadChangeLocationList(this.start, this.pageSize,  searchBody );
}


  }
  async loadChangeLocationList(start: number, pageSize: number, searchBody: any) {
    this.listContainerBlockUi.start();
    this.changeLocationService.doSearch(start, pageSize, this.orderType?.key, this.orderParam?.key, searchBody).subscribe(async (response: CommonListResponse<ChangeLocationView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.cardOrListViewComponent.items=[];
            response.list.forEach((element: ChangeLocationView) => {
                let machineView = new ChangeLocationView(element)
                this.cardOrListViewComponent.addItem(machineView)
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
                case "status":
                    searchBody[key] = { key: value.appliedValue };
                    break;
                case "changeLocationView":
                    searchBody[key] = { id: value.appliedValue };
                    break;
                case "date-range":
                        let appliedValue: KeyValueView[] = value.appliedValue as KeyValueView[];
                        searchBody['startDate'] = appliedValue.find((d: KeyValueView) => d.key === 'start')?.value;
                        searchBody['endDate'] = appliedValue.find((d: KeyValueView) => d.key === 'end')?.value;
                        break;
                default:
                    searchBody[key] = value.appliedValue;
                    break;
            }
        }
    });
    this.start = this.cardOrListViewComponent.start;
    this.pageSize=this.cardOrListViewComponent.pageSize;
    this.loadChangeLocationList(this.start, this.pageSize, searchBody);
    }

}
