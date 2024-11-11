import { AfterViewInit, Component, Inject, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChartService, ChartQuery } from '../../akita/chart';
import { ChartInitData } from '../../chart-init-data';
import { CHART_WRAPPER_SERVICE, ChartWrapperService } from '../../chart-services/chart-wrapper-service';
import { ChartType } from '../../enums';
import { ChartRawData, DrillDownStatus } from '../../interface';
import { getChartTotal, getStackChartMaxValue, getScaleYValues } from '../../utils';
import { GraphsetData, ZingData, ZingSeries } from '../../zing-data';
import { CustomZingChartAngularComponent } from '../../zingchart';

@Component({
  selector: 'app-column-chart',
  template: `<zingchart-angular
                #columnChart
                [id]="chartId"
                (node_click)="onNodeClick($event)"
                [config]="columnChartData"
            >
            </zingchart-angular> `,
})
export class ColumnChartComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() scaleYLabel: string = '';
  @Input() isStackedColumnChart: boolean = true;
  @Input() minItemsDisplayWOAngle: number = 4;
  @ViewChild('columnChart') columnChart!: CustomZingChartAngularComponent;

  columnChartData: GraphsetData;
  chartId: string;
  readonly DEFAULT_HEIGHT = 266;

  private unsubscribe = new Subject<void>();

  constructor(
    @Inject(CHART_WRAPPER_SERVICE) private chartWrapperService: ChartWrapperService,
    private chartService: ChartService,
    private injector: Injector,
    private chartQuery: ChartQuery
  ) { }

  ngOnInit() {
    this.chartWrapperService = this.injector.get<ChartWrapperService>(CHART_WRAPPER_SERVICE);
    const id = this.chartWrapperService.getChartEntityId();

    const chartRawData$ = this.chartQuery.getChartRawDataObservable(id);
    const isAggregated$ = this.chartQuery.getAggregateObservable(id);
    const hasPlotTotal$ = this.chartQuery.getPlotObservable(id);
    const drillDownStatus$ = this.chartQuery.getDrillDownObservable(id);

    combineLatest([chartRawData$, isAggregated$, hasPlotTotal$, drillDownStatus$])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([chartRawData, isAggregated, hasPlotTotal, drillDownStatus]) => {
        if (chartRawData) {
          this.columnChartData = this.prepareColumnChartData(
            chartRawData,
            isAggregated,
            hasPlotTotal,
            drillDownStatus
          );
          this.chartWrapperService.setHeight(this.DEFAULT_HEIGHT);

          if (_.filter(this.columnChartData.graphset, (g: ZingData) => !g.series.length).length) {
            this.chartWrapperService.chartType = null;
          } else {
            this.chartWrapperService.chartType = this.columnChart;
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.chartWrapperService.chartType = this.columnChart;
    this.chartWrapperService.setHeight(this.DEFAULT_HEIGHT);
  }

  private prepareColumnChartData(
    chartRawData: ChartRawData,
    isAggregated: boolean,
    hasPlotTotal: boolean,
    drillDownStatus: DrillDownStatus
  ): GraphsetData {
    const stackedColumnChart = ChartInitData.getColumnChartInitData();
    stackedColumnChart.scaleX.labels =
      !drillDownStatus && isAggregated ? [''] : chartRawData.labels.map(item => item.toString());
    if (stackedColumnChart.scaleX.labels.length > this.minItemsDisplayWOAngle) {
      stackedColumnChart.scaleX.item.angle = '-35';
    }
    if (isAggregated) {
      stackedColumnChart.plot.cursor = 'hand';
    }
    stackedColumnChart.scaleX.maxItems = chartRawData.labels.length;
    this.chartWrapperService.total = 0;

    _.forEach(chartRawData.legends, (legend, legendIndex) => {
      const series: ZingSeries = {
        values: [],
      };

      _.forEach(chartRawData.labels, (label, labelIndex) => {
        if (drillDownStatus && legend.name === drillDownStatus?.legendName) {
          if (chartRawData.series[labelIndex]?.values) {
            // this condition because of Country of Origin for International Students gives values "null"
            series.values.push(chartRawData.series[labelIndex]?.values[legendIndex]);
          }
        } else if (
          !drillDownStatus &&
          chartRawData.legends[legendIndex]?.isSelected &&
          chartRawData.series[labelIndex]?.values?.length > 0
        ) {
          series.values.push(chartRawData.series[labelIndex]?.values[legendIndex]);
        } else {
          series.values.push(0);
        }
      });
      console.log(series)

      series.text = legend.name;
      series.backgroundColor = chartRawData.classNames[legendIndex];
      series['data-background-color'] = chartRawData.classNames[legendIndex];
      series['data-legend-name'] = chartRawData.legends[legendIndex].name;
      stackedColumnChart.series.push(series);
    });
    this.chartWrapperService.total = getChartTotal(stackedColumnChart.series);
    stackedColumnChart.plot.stacked = this.isStackedColumnChart;
    if (hasPlotTotal) {
      stackedColumnChart.plot.valueBox.rules.push({
        text: this.isStackedColumnChart ? '%total' : '%v',
        rule: this.isStackedColumnChart ? '%total <= 0' : '%v <= 0',
        visible: false,
      });
      stackedColumnChart.plot.valueBox.text = this.isStackedColumnChart ? '%total' : '%v';
    }

    if (this.scaleYLabel) {
      stackedColumnChart.scaleY.label.text = this.scaleYLabel;
    }

    if (!drillDownStatus && isAggregated) {
      stackedColumnChart.series.forEach(item => {
        item.values = [_.sum(item.values)];
      });
    }
    const maxValue: number = this.isStackedColumnChart
      ? getStackChartMaxValue(stackedColumnChart.series, stackedColumnChart.scaleX.labels)
      : _.max(stackedColumnChart.series.map(item => _.max(item.values)));
    stackedColumnChart.scaleY.values = getScaleYValues(maxValue);

    const stackedColumnChartsList: ZingData[] = [];
    if (this.chartWrapperService.total > 0) {
      stackedColumnChartsList.push(stackedColumnChart);
    } else {
      stackedColumnChartsList.push(ChartInitData.getColumnChartInitData());
    }
    return { graphset: stackedColumnChartsList };
  }

  onNodeClick(event: object) {
    const chartEntityModel = this.chartWrapperService.getChartEntity();
    if (chartEntityModel?.isAggregated) {
      const drillDownStatus: DrillDownStatus = {
        legendName: event['data-legend-name'],
        lastSelectedChartType: ChartType.StackedColumn,
      };
      this.chartService.updateDrillDownStatus(
        this.chartWrapperService.getChartEntityId(),
        drillDownStatus,
        this.chartWrapperService.getDrillDownChartTypeSelector(),
        false
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
