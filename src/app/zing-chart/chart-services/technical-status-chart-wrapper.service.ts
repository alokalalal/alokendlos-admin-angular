import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardView } from 'src/app/entities/dashboard-view';
import { MachineView } from 'src/app/entities/machine-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ChartService, ChartQuery } from '../akita/chart';
import { ChartInitData } from '../chart-init-data';
import { Constants } from '../constants';
import { ChartType } from '../enums';
import { ChartActionSectionSetup, ChartButtonGroupSetup } from '../interface';
import { ZingData } from '../zing-data';
import { HttpClient } from '@angular/common/http';

import { ChartWrapperService } from './chart-wrapper-service';
import { Apiurl, AppUrl } from 'src/app/constants/app-url';
import { CommonViewResponse } from 'src/app/responses/common-view-response';

@Injectable()
export class TechnicalStatusChartWrapperService extends ChartWrapperService {
    public drillDownChartType: ChartType = ChartType.Pie;
    public chartName = 'Technical Status';
    public chartStoreKey = Constants.technicalStatus;

    constructor(
        protected override router: Router,
        protected override chartService: ChartService,
        protected override chartQuery: ChartQuery,
        private http: HttpClient, 
        private snackBarService: SnackBarService
    ) {
        super(router, chartService, chartQuery);
    }


    getChartButtonGroupConfig(): ChartButtonGroupSetup {
        this.chartEntity = this.getChartEntity();
        return {
            hasCopyButton: true,
            chartTypeSelectors: this.getChartTypeSelectors([ChartType.LineArea, ChartType.StackedColumn, ChartType.Pie]),
            menuButton: {
                aggregateSection: {
                    hasButton: true,
                },
                totalSection: {
                    hasButton: true,
                    isSelected: this.chartEntity?.hasPlotTotal ?? false,
                },
                legendSection: {
                    hasButton: true,
                    isSelected: true,
                },
                hasShowGuideButton: false,
                hasDownloadPDFButton: true,
                hasDownloadCSVButton: true,
                hasDownloadXLSButton: true,
                hasPrintButton: true,
            },
        };
    }

    getChartActionSectionConfig(): ChartActionSectionSetup {
        return { hasViewButton: true };
    }

    getInitialData(): ZingData {
        return ChartInitData.getColumnChartInitData();
    }

    // doGetMachineStatus(searchBody: any): Observable<any> {
    //     return this.http.post<CommonListResponse<DashboardView>>(
    //         AppUrl.BASE_URL + Apiurl.PRIVATE_DASHBOARD_URL + "/get-machine-status" ,searchBody);
    // }
}
