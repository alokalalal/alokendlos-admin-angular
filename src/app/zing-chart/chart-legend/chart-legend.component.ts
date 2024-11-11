import { Component, Inject } from '@angular/core';
import * as _ from 'lodash';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChartQuery, ChartService } from '../akita/chart';
import { CHART_WRAPPER_SERVICE, ChartWrapperService } from '../chart-services/chart-wrapper-service';
import { Legend, DrillDownStatus } from '../interface';

@Component({
    selector: 'app-chart-legend',
    templateUrl: 'chart-legend.component.html',
    styleUrls: ['chart-legend.component.scss'],
})
export class ChartLegendComponent {
    public legends: Legend[];
    private unsubscribe = new Subject<void>();
    public isLegendSectionVisible;
    public drillDownStatus$: Observable<DrillDownStatus>;

    constructor(
        @Inject(CHART_WRAPPER_SERVICE) public chartWrapperService: ChartWrapperService,
        protected chartQuery: ChartQuery,
        protected chartService: ChartService
    ) {
        const id = this.chartWrapperService.getChartEntityId();
        const chartRawData$ = this.chartQuery.getChartRawDataObservable(id);
        const hasLegend$ = this.chartQuery.getLegendObservable(id);
        this.drillDownStatus$ = this.chartQuery.getDrillDownObservable(id);

        combineLatest([chartRawData$, hasLegend$, this.drillDownStatus$])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([chartRawData, hasLegend, drillDownStatus]) => {
                if (drillDownStatus) {
                    this.legends = _.filter(chartRawData.legends, (c: Legend) => c.name === drillDownStatus.legendName);
                } else {
                    this.legends = chartRawData?.legends;
                }
                this.isLegendSectionVisible = hasLegend;
            });
    }

    hideShowLegend(legend: Legend) {
        this.chartService.updateLegend(this.chartWrapperService.getChartEntityId(), legend);
    }
}
