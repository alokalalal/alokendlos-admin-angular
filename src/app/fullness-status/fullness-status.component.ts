import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CustomerView } from '../entities/customer-view';
import { DashboardView } from '../entities/dashboard-view';
import { LocationView } from '../entities/location-view';
import { MachineView } from '../entities/machine-view';
import { TransactionView } from '../entities/transaction-view';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { CustomerService } from '../services/customer.service';
import { DashboardService } from '../services/dashboard.service';
import { LocationService } from '../services/location.service';
import { SnackBarService } from '../services/snackbar.service';
import { ChartEntity, ChartQuery, ChartService } from '../zing-chart/akita/chart';
import { CHART_WRAPPER_SERVICE } from '../zing-chart/chart-services/chart-wrapper-service';
import { FullnessStatusChartWrapperService } from '../zing-chart/chart-services/fullness-status-chart-wrapper.service';
import { Constants } from '../zing-chart/constants';
import { ChartType } from '../zing-chart/enums';
import { ChartTypeSelector } from '../zing-chart/interface';

@Component({
  selector: 'app-fullness-status',
  templateUrl: './fullness-status.component.html',
  styleUrls: ['./fullness-status.component.css'],
  providers: [{ provide: CHART_WRAPPER_SERVICE, useClass: FullnessStatusChartWrapperService }],
})
export class FullnessStatusComponent implements OnInit {

  chartType$!: Observable<ChartTypeSelector>;
  chartType = ChartType;
  @Input() transactionModel: any;

  constructor(@Inject(CHART_WRAPPER_SERVICE) private chartWrapperService: FullnessStatusChartWrapperService,
    private dashboardService: DashboardService,
    private chartQuery: ChartQuery,
    private chartService: ChartService,
    private snackBarService: SnackBarService,
    private customerService: CustomerService,
    private locationService: LocationService,
  ) { }
  dashboardView: DashboardView = new DashboardView();
  data: any;
  customerList: CustomerView[] | undefined;
  locationList: LocationView[] | undefined;
  customer: any;
  location: any;
  async ngOnInit() {
    console.log("transactionModel", this.transactionModel)
    await this.dashboardService.doGetMachineFulnessStatus({}).then((response: CommonViewResponse<DashboardView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.dashboardView = response.view;
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
    })

    /* await this.customerService.doGetCustomerDropdown().then((response: CommonListResponse<CustomerView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.customerList = response.list;
      }
    }); */

    if (this.transactionModel == undefined) {
      this.loadChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.transactionModel != undefined) {
      let transactionView = this.transactionModel;
      this.getFullnessStatus(transactionView);
      // if (this.transactionModel.customerView != undefined) {
      //   this.changeCustomer(this.transactionModel.customerView);
      // } if (this.transactionModel.locationView != undefined) {
      //   this.changeLocation(this.transactionModel.locationView);
      // } 
      // if (this.transactionModel.machineViews != undefined) {
      //   this.changeMachine(this.transactionModel.machineViews);
      // }
    }
  }


  getFullnessStatus(transactionView: any) {
    this.dashboardService.doGetMachineFulnessStatus(transactionView).then((response: CommonViewResponse<DashboardView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.dashboardView = response.view;
        this.loadChart();
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
    })
  }

  changeCustomer(customer: any) {
    let machineView = new MachineView();
    machineView.customerView = new CustomerView(customer);

    this.getFullnessStatus(machineView);

    let locationView = new LocationView();
    locationView.customerView = new CustomerView(customer);
    this.locationService.doGetLocationDropdown(locationView).then((response: CommonListResponse<LocationView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.locationList = response.list;
      }
    });
  }

  changeMachine(machine: any) {
    let machineView = new MachineView();
    machineView.machineViews = machine;

    this.getFullnessStatus(machineView);

    let locationView = new LocationView();
    locationView.machineViews = machine;
    this.locationService.doGetLocationDropdown(locationView).then((response: CommonListResponse<LocationView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.locationList = response.list;
      }
    });
  }

  changeLocation(machine: any) {
    let machineView = new MachineView();
    machineView.locationView = new LocationView(machine);
    this.getFullnessStatus(machineView);
  }

  loadChart() {
    this.data = {
      "id": "fullnessStatus",
      "chartRawData": {
        "labels": [""],
        "series": [{
          "values": [Number(this.dashboardView.lessthen90machine), Number(this.dashboardView.between60to90machine), Number(this.dashboardView.morethen90machine)],
          "data": [Number(this.dashboardView.lessthen90machine), Number(this.dashboardView.between60to90machine), Number(this.dashboardView.morethen90machine)]
        }],
        "legends": [{
          "id": 1,
          "name": "Less Than 60%",
          "className": "#AACC0D",
          "isSelected": true
        }, {
          "id": 2,
          "name": "60%-90%",
          "className": "#FFA500",
          "isSelected": true
        }, {
          "id": 3,
          "name": "More Than 90%",
          "className": "#FB3640",
          "isSelected": true
        }],
        "classNames": ["#AACC0D", "#FFA500", "#FB3640"]
      },
      "hasLegend": true
    }

    this.chartType$ = this.chartQuery.getChartTypeSelectorObservable(this.chartWrapperService.getChartEntityId()) as Observable<ChartTypeSelector>;
    const id = `${Constants.fullnessStatus}`;
    const chartEntityModel = this.chartQuery.get(id);
    const chartTypeSelector =
      chartEntityModel?.chartTypeSelector ??
      _.find(Constants.chartTypeSelectors, (c: ChartTypeSelector) => c.type === ChartType.Pie);
    const chartEntity: ChartEntity = {
      id,
      chartRawData: this.data.chartRawData,
      hasLegend: !!this.data.chartRawData?.legends?.length,
      filter: this.data.filter,
      chartTypeSelector,
    };
    if (chartEntityModel) {
      this.chartService.update(id, chartEntity);
    } else {
      chartEntity.isAggregated = true;
      this.chartService.add(chartEntity);
    }
  }
}
