import { AfterViewInit, Component, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListenerService } from 'src/app/services/listner.service';
import { MachineService } from 'src/app/services/machine.service';
import { ChartService, ChartQuery } from '../../akita/chart';
import { FilterDataService } from '../../akita/chart/filter-data';
import { ChartInitData } from '../../chart-init-data';
import { CHART_WRAPPER_SERVICE, ChartWrapperService } from '../../chart-services/chart-wrapper-service';
import { ChartType } from '../../enums';
import { ChartRawData, DrillDownStatus } from '../../interface';
import { GraphsetData, ZingData } from '../../zing-data';
import { CustomZingChartAngularComponent } from '../../zingchart';

@Component({
    selector: 'app-pie-chart',
    template: ` <zingchart-angular style="cursor: pointer" (node_click)="onNodeClick($event)" width="100%" #pieChart [config]="pieChartData" (label_click)="onLabelClick($event)"></zingchart-angular>`,
})
export class PieChartComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('pieChart') pieChart: CustomZingChartAngularComponent;

    pieChartData: GraphsetData;
    readonly DEFAULT_HEIGHT_WITHOUT_SHOW_TOTAL = 266;
    readonly DEFAULT_HEIGHT_WITH_SHOW_TOTAL = 356;
    private unsubscribe = new Subject<void>();

    private static addPlotToInitialData(pieData: ZingData): void {
        pieData.plot.valueBox.text =
            '<div style="text-align: center;margin-bottom: 2px;display: inline-block;border-bottom: 1px solid;width: 100%;">%t</div><br/>%v | %npv% ';
        pieData.plot.valueBox.placement = 'out';
        pieData.plot.tooltip.text = '';
        pieData.width = '100%';
    }

    private static changePlotFontStyle(pieData: ZingData): void {
        pieData.plot.valueBox.fontColor = 'white';
        pieData.plot.valueBox.fontWeight = 400;
    }

    constructor(
        @Inject(CHART_WRAPPER_SERVICE) private chartWrapperService: ChartWrapperService,
        private chartService: ChartService,
        private injector: Injector,
        private chartQuery: ChartQuery,
        private filterDataService: FilterDataService,
        private machineService: MachineService,
        private listnerService:ListenerService
    ) {}

    ngOnInit() {
        this.chartWrapperService = this.injector.get<ChartWrapperService>(CHART_WRAPPER_SERVICE);
        const id = this.chartWrapperService.getChartEntityId();

        const chartRawData$ = this.chartQuery.getChartRawDataObservable(id);
        const isAggregated$ = this.chartQuery.getAggregateObservable(id);
        const hasPlotTotal$ = this.chartQuery.getPlotObservable(id);

        combineLatest([chartRawData$, isAggregated$, hasPlotTotal$])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([chartRawData, isAggregated, hasPlotTotal]) => {
                if (chartRawData) {
                    if (isAggregated) {
                        this.pieChartData = this.getAggregatePieChartData(chartRawData, hasPlotTotal);
                    } else {
                        this.pieChartData = this.getPieChartData(chartRawData, hasPlotTotal);
                    }

                    if (_.filter(this.pieChartData.graphset, (g: ZingData) => !g.series.length).length) {
                        this.chartWrapperService.setHeight(this.pieChartData.height);
                        this.chartWrapperService.chartType = null;
                    } else {
                        this.chartWrapperService.chartType = this.pieChart;
                        this.chartWrapperService.setHeight(this.pieChartData.height);
                    }
                }
            });
    }

    ngAfterViewInit(): void {
        this.chartWrapperService.chartType = this.pieChart;
    }

    getPieChartData(chartRawData: ChartRawData, hasPlotTotal: boolean): GraphsetData {
        const pieChartsList: ZingData[] = [];
        this.chartWrapperService.total = 0;
        _.forEach(chartRawData.labels, (label: string, index) => {
            const pieData: ZingData = ChartInitData.getPieChartInitData();
            if (hasPlotTotal) {
                PieChartComponent.addPlotToInitialData(pieData);
            } else {
                PieChartComponent.changePlotFontStyle(pieData);
            }
            pieData.title.text = label;

            const tempSeries = [];
            let total = 0;
            _.forEach(chartRawData.series[index].values, (data, i) => {
                if (chartRawData.legends && chartRawData.legends[i]?.isSelected && data > 0) {
                    total += data;
                    pieData.labels[0].text = total.toString();
                    this.chartWrapperService.total += data;
                    tempSeries.push({
                        values: [data],
                        text: chartRawData.legends[i].name,
                        backgroundColor: chartRawData.classNames[i],
                        'data-background-color': chartRawData.classNames[i],
                    });
                }
            });

            pieData.series = tempSeries;
            if (pieData.series.length > 0) {
                pieChartsList.push(pieData);
            }
        });
        let layout: string, height: number;
        if (!pieChartsList.length) {
            pieChartsList.push(ChartInitData.getPieChartInitData());
            layout = '1x1';
        } else if (pieChartsList.length === 1) {
            layout = '1x1';
        } else if (hasPlotTotal) {
            layout = pieChartsList.length + 'x1';
        } else {
            layout = Math.ceil((pieChartsList.length || 1) / 2) + 'x2';
        }
        if (hasPlotTotal) {
            height = Math.ceil(pieChartsList.length || 1) * this.DEFAULT_HEIGHT_WITH_SHOW_TOTAL;
        } else {
            height = Math.ceil((pieChartsList.length || 1) / 2) * this.DEFAULT_HEIGHT_WITHOUT_SHOW_TOTAL;
        }
        return {
            height,
            layout,
            graphset: pieChartsList,
            backgroundColor: 'white',
        };
    }

    public getAggregatePieChartData(chartRawData: ChartRawData, hasPlotTotal: boolean): GraphsetData {
        const pieData: ZingData = ChartInitData.getPieChartInitData();
        let height: number;
        if (hasPlotTotal) {
            PieChartComponent.addPlotToInitialData(pieData);
        } else {
            PieChartComponent.changePlotFontStyle(pieData);
        }
        pieData.title.text = '';
        pieData.plot.cursor = 'hand';
        this.chartWrapperService.total = 0;
        const series = [];
        _.forEach(chartRawData.legends, (legend, legendIndex) => {
            let total = 0;
            _.forEach(chartRawData.labels, (label, labelIndex) => {
                if (
                    chartRawData.legends &&
                    chartRawData.legends[legendIndex]?.isSelected &&
                    chartRawData.series[labelIndex]?.values?.length > 0
                ) {
                    total += chartRawData.series[labelIndex].values[legendIndex];
                }
            });

            series.push({
                values: [total],
                text: legend.name,
                backgroundColor: chartRawData.classNames[legendIndex],
                'data-background-color': chartRawData.classNames[legendIndex],
                'data-legend-name': chartRawData.legends[legendIndex].name,
                'data-legend-id':chartRawData.legends[legendIndex].id,
            });
            this.chartWrapperService.total += total;
        });
        pieData.labels[0].text = this.chartWrapperService.total.toString();
        if (this.chartWrapperService.total > 0) {
            pieData.series = series;
        }
        const aggregateChartsList: ZingData[] = [];
        if (this.chartWrapperService.total > 0) {
            aggregateChartsList.push(pieData);
        } else {
            aggregateChartsList.push(ChartInitData.getPieChartInitData());
        }
        if (hasPlotTotal) {
            height = Math.ceil(aggregateChartsList.length || 1) * this.DEFAULT_HEIGHT_WITH_SHOW_TOTAL;
        } else {
            height = Math.ceil((aggregateChartsList.length || 1) / 2) * this.DEFAULT_HEIGHT_WITHOUT_SHOW_TOTAL;
        }
        return {
            layout: '1x1',
            graphset: aggregateChartsList,
            backgroundColor: 'white',
            height,
        };
    }

    onNodeClick(event: object) {
        const id = this.chartWrapperService.getChartEntityId();
        this.filterDataService.addOrUpdate( this.machineService.getMachineEntityId(), {"legendName":event['data-legend-id'],"chartId":id});
        this.listnerService.dashboardChanged();

        // const chartEntityModel = this.chartWrapperService.getChartEntity();
        // if (chartEntityModel?.isAggregated) {
        //     const drillDownStatus: DrillDownStatus = {
        //         legendName: event['data-legend-name'],
        //         lastSelectedChartType: ChartType.Pie,
        //     };
        //     this.chartService.updateDrillDownStatus(
        //         this.chartWrapperService.getChartEntityId(),
        //         drillDownStatus,
        //         this.chartWrapperService.getDrillDownChartTypeSelector(),
        //         false
        //     );
        // }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onLabelClick(event){
        const id = this.chartWrapperService.getChartEntityId();
        this.filterDataService.addOrUpdate( this.machineService.getMachineEntityId(), {"chartId":id});
        this.listnerService.dashboardChanged();

    }
}
