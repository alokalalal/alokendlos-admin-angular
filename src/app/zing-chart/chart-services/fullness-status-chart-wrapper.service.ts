import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apiurl, AppUrl } from 'src/app/constants/app-url';
import { DashboardView } from 'src/app/entities/dashboard-view';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ChartService, ChartQuery } from '../akita/chart';
import { ChartInitData } from '../chart-init-data';
import { Constants } from '../constants';
import { ChartType } from '../enums';
import { ChartActionSectionSetup, ChartButtonGroupSetup } from '../interface';
import { ZingData } from '../zing-data';

import { ChartWrapperService } from './chart-wrapper-service';

@Injectable()
export class FullnessStatusChartWrapperService extends ChartWrapperService {
    public drillDownChartType: ChartType = ChartType.Pie;
    public chartName = 'Fullness Status';
    public chartStoreKey = Constants.fullnessStatus;

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
}
