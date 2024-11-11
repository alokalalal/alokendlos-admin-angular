import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { transaction } from '@datorama/akita';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CustomerView } from '../entities/customer-view';
import { DashboardView } from '../entities/dashboard-view';
import { LocationView } from '../entities/location-view';
import { TransactionView } from '../entities/transaction-view';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { CustomerService } from '../services/customer.service';
import { DashboardService } from '../services/dashboard.service';
import { ListenerService } from '../services/listner.service';
import { LocationService } from '../services/location.service';
import { MachineService } from '../services/machine.service';
import { SnackBarService } from '../services/snackbar.service';
import { ChartEntity, ChartQuery, ChartService } from '../zing-chart/akita/chart';
import { CHART_WRAPPER_SERVICE } from '../zing-chart/chart-services/chart-wrapper-service';
import { TechnicalStatusChartWrapperService } from '../zing-chart/chart-services/technical-status-chart-wrapper.service';
import { Constants } from '../zing-chart/constants';
import { ChartType } from '../zing-chart/enums';
import { ChartTypeSelector } from '../zing-chart/interface';
interface Customer {
  value: string;
  viewValue: string;
}
interface Location {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-technical-status',
  templateUrl: './technical-status.component.html',
  styleUrls: ['./technical-status.component.css'],
  providers: [{ provide: CHART_WRAPPER_SERVICE, useClass: TechnicalStatusChartWrapperService }],
})
export class TechnicalStatusComponent implements OnInit {
  @Input() transactionModel: any;
  chartType$!: Observable<ChartTypeSelector>;
  chartType = ChartType;
  constructor(@Inject(CHART_WRAPPER_SERVICE) private chartWrapperService: TechnicalStatusChartWrapperService,
    private dashboardService: DashboardService,
    private chartQuery: ChartQuery,
    private chartService: ChartService,
    private snackBarService: SnackBarService,
    private customerService: CustomerService,
    private locationService: LocationService,
    private machineService: MachineService,
    private listnerService: ListenerService
  ) { }
  dashboardView: DashboardView = new DashboardView();
  data: any;
  customerList: CustomerView[] | undefined;
  locationList: CustomerView[] | undefined;
  customer: any;
  location: any;
  // data: any = { "id": "enquiryByMonth", "chartRawData": { "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], "series": [{ "values": [0, 126, 0, 90, 0], "data": [0, 126, 0, 90, 0] }, { "values": [396, 27, 45, 18, 0], "data": [396, 27, 45, 18, 0] }, { "values": [171, 18, 9, 171, 0], "data": [171, 18, 9, 171, 0] }, { "values": [189, 54, 9, 0, 0], "data": [189, 54, 9, 0, 0] }, { "values": [99, 261, 18, 234, 12], "data": [99, 261, 18, 234, 12] }, { "values": [117, 18, 9, 288, 7], "data": [117, 18, 9, 288, 7] }, { "values": [63, 54, 72, 0, 0], "data": [63, 54, 72, 0, 0] }, { "values": [81, 45, 54, 0, 0], "data": [81, 45, 54, 0, 0] }, { "values": [18, 153, 117, 90, 0], "data": [18, 153, 117, 90, 0] }, { "values": [36, 126, 54, 36, 0], "data": [36, 126, 54, 36, 0] }, { "values": [27, 9, 81, 135, 0], "data": [27, 9, 81, 135, 0] }, { "values": [36, 0, 63, 18, 0], "data": [36, 0, 63, 18, 0] }], "legends": [{ "id": 1, "name": "2018", "className": "#6610f2", "isSelected": true }, { "id": 2, "name": "2019", "className": "#20c997", "isSelected": true }, { "id": 3, "name": "2020", "className": "#007bff", "isSelected": true }, { "id": 4, "name": "2021", "className": "#dc3545", "isSelected": true }, { "id": 5, "name": "2022", "className": "#fd7e14", "isSelected": true }], "classNames": ["#6610f2", "#20c997", "#007bff", "#dc3545", "#fd7e14"] }, "hasLegend": true, "filter": { "intakeYear": [2019, 2020, 2021, 2023, null, 2018, 2022, 2024, 2025], "intakeYearLevels": [15, 16, 17, 18, 31, 19, 22, 23, 24, 25, 26, 27, 28, 30, null], "selectedStages": [2871, 2870, 2869, 2872], "statuses": [174, 179, 176, 175, 172, 171, 173, 180, 177, 1395, 178, 1346, 1345], "startCreatedDate": "2018-02-02T14:43:39.000Z", "endCreatedDate": "2022-06-27T05:11:26.000Z" }, "chartTypeSelector": { "type": 4, name: 'Stacked Column Chart', icon: 'stacked_bar_chart', }, "enquiryCountSnapshot": [{ "enquiryCount": 1233, "year": "2018", "enquirieCountTillCurrentMonth": 1017 }, { "enquiryCount": 891, "year": "2019", "enquirieCountTillCurrentMonth": 540 }, { "enquiryCount": 531, "year": "2020", "enquirieCountTillCurrentMonth": 144 }, { "enquiryCount": 1080, "year": "2021", "enquirieCountTillCurrentMonth": 801 }, { "enquiryCount": 19, "year": "2022", "enquirieCountTillCurrentMonth": 19 }] }

  async ngOnInit() {
    await this.dashboardService.doGetMachineStatus({}).then((response: CommonViewResponse<DashboardView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        console.log(response)
        this.dashboardView = response.view;
        console.log(this.dashboardView)
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
    })
    if (this.transactionModel == undefined) {
      this.loadChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.transactionModel)
    if (this.transactionModel != undefined) {
      let transactionView = this.transactionModel;
      this.getMachineStatus(transactionView);
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

  getMachineStatus(transactionView: any) {
    this.dashboardService.doGetMachineStatus(transactionView).then((response: CommonViewResponse<DashboardView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.dashboardView = response.view;
        console.log(this.dashboardView)
        this.loadChart();
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
    })
  }

  changeCustomer(customer: any) {
    console.log(customer)
    // this.filterDataService.addOrUpdate(this.customerService.getCustomerEntityId(), customer);
    // this.filterDataService.addOrUpdate(this.locationService.getLocationEntityId(), {});
    // this.listnerService.dashboardChanged()

    let transactionView = new TransactionView();
    transactionView.customerView = new CustomerView(customer);
    this.getMachineStatus(transactionView);
  }

  changeMachine(machine: any) {
    console.log(machine)
    // this.filterDataService.addOrUpdate(this.customerService.getCustomerEntityId(), customer);
    // this.filterDataService.addOrUpdate(this.locationService.getLocationEntityId(), {});
    // this.listnerService.dashboardChanged()

    let transactionView = new TransactionView();
    transactionView.machineViews = machine;
    this.getMachineStatus(transactionView);
  }

  changeLocation(location: any) {
    // this.filterDataService.addOrUpdate(this.locationService.getLocationEntityId(), location);
    // this.listnerService.dashboardChanged()

    let transactionView = new TransactionView();
    transactionView.locationView = new LocationView(location);
    this.getMachineStatus(transactionView);
  }

  loadChart() {
    this.data = {
      "id": "technicalStatus",
      "chartRawData": {
        "labels": [""],
        "series": [{
          "values": [Number(this.dashboardView.readyMachine), Number(this.dashboardView.warningMachine), Number(this.dashboardView.errorMachine)],
          "data": [Number(this.dashboardView.readyMachine), Number(this.dashboardView.warningMachine), Number(this.dashboardView.errorMachine)]
        }],
        "legends": [{
          "id": 1,
          "name": "Ready",
          "className": "#AACC0D",
          "isSelected": true
        }, {
          "id": 2,
          "name": "Warning",
          "className": "#FFA500",
          "isSelected": true
        }, {
          "id": 3,
          "name": "Error",
          "className": "#FB3640",
          "isSelected": true
        }],
        "classNames": ["#AACC0D", "#FFA500", "#FB3640"]
      },
      "hasLegend": true
    }

    this.chartType$ = this.chartQuery.getChartTypeSelectorObservable(this.chartWrapperService.getChartEntityId()) as Observable<ChartTypeSelector>;
    const id = `${Constants.technicalStatus}`;
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
