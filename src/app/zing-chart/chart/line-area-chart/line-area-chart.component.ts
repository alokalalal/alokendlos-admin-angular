import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChartQuery } from '../../akita/chart';
import { ChartInitData } from '../../chart-init-data';
import { ChartWrapperService, CHART_WRAPPER_SERVICE } from '../../chart-services/chart-wrapper-service';
import { ChartRawData } from '../../interface';
import { getChartTotal, getScaleYValues, getStackChartMaxValue, lineAreaChartCommonProperty, lineChartCommonProperty } from '../../utils';
import { GraphsetData, ZingData } from '../../zing-data';
import { CustomZingChartAngularComponent } from '../../zingchart';

@Component({
  selector: 'app-line-area-chart',
  template: `<zingchart-angular
                  [id]="chartId"
                  width="100%"
                  #areaChart
                  [config]="areaChartData"
              ></zingchart-angular>`,
})
export class LineAreaChartComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() scaleYLabel: string = '';
  @Input() minItemsDisplayWOAngle: number = 4;
  @Input() isLineChart: boolean = false;
  @ViewChild('areaChart') areaChart: CustomZingChartAngularComponent;
  areaChartData: GraphsetData;
  chartId: string;
  readonly DEFAULT_HEIGHT = 266;
  private unsubscribe = new Subject<void>();

  constructor(
    @Inject(CHART_WRAPPER_SERVICE) private chartWrapperService: ChartWrapperService,
    private chartQuery: ChartQuery,
  ) { }

  ngOnInit() {
    const id = this.chartWrapperService.getChartEntityId();
    const chartRawData$ = this.chartQuery.getChartRawDataObservable(id);
    const hasPlotTotal$ = this.chartQuery.getPlotObservable(id);
    combineLatest([chartRawData$, hasPlotTotal$])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([chartRawData, hasPlotTotal]) => {
        if (chartRawData) {
          this.areaChartData = this.prepareLineAreaChartData(chartRawData, hasPlotTotal);
          this.chartWrapperService.setHeight(this.DEFAULT_HEIGHT);

          if (_.filter(this.areaChartData.graphset, (g: ZingData) => !g.series.length).length) {
            this.chartWrapperService.chartType = null;
          } else {
            this.chartWrapperService.chartType = this.areaChart;
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.chartWrapperService.chartType = this.areaChart;
    this.chartWrapperService.setHeight(this.DEFAULT_HEIGHT);
  }

  private prepareLineAreaChartData(
    chartRawData: ChartRawData,
    hasPlotTotal: boolean
  ): GraphsetData {
    const areaChart = ChartInitData.getLineAreaChartInitData();
    const lineAndAreaChartCommonProperty = this.isLineChart ? lineChartCommonProperty : lineAreaChartCommonProperty;
    areaChart.type = lineAndAreaChartCommonProperty.type;

    if (hasPlotTotal) {
      areaChart.plot.valueBox.rules.push({
        text: lineAndAreaChartCommonProperty.plotRuleText,
        rule: lineAndAreaChartCommonProperty.plotRulerule,
        visible: false,
      });
      areaChart.plot.valueBox.text = lineAndAreaChartCommonProperty.plotRuleText;
    }
    areaChart.plot.aspect = 'spline';
    areaChart.plot.stacked = lineAndAreaChartCommonProperty.stacked;
    areaChart.scaleX.labels = chartRawData.labels.map(item => item.toString());
    if (areaChart.scaleX.labels.length > this.minItemsDisplayWOAngle) {
      areaChart.scaleX.item.angle = '-35';
    }
    areaChart.scaleX.maxItems = chartRawData.labels.length;
    this.chartWrapperService.total = 0;

    _.forEach(chartRawData.legends, (legend, legendIndex) => {
      const series: any = {};
      series.values = [];

      _.forEach(chartRawData.labels, (label, labelIndex) => {
        if (chartRawData.legends[legendIndex]?.isSelected && chartRawData.series[labelIndex]?.values?.length > 0) {
          series.values.push(chartRawData.series[labelIndex]?.values[legendIndex]);
        }
      });
      series.text = legend.name;
      series['data-background-color'] = chartRawData.classNames[legendIndex];
      series['line-color'] = chartRawData.classNames[legendIndex];
      series['background-color'] = chartRawData.classNames[legendIndex];
      series.marker = {};
      series.marker['background-color'] = chartRawData.classNames[legendIndex];
      areaChart.series.push(series);
    });

    if (this.scaleYLabel) {
      areaChart.scaleY.label.text = this.scaleYLabel;
    }

    this.chartWrapperService.total = getChartTotal(areaChart.series);

    const maxValue: any = this.isLineChart
      ? _.max(areaChart.series.map(item => _.max(item.values)))
      : getStackChartMaxValue(areaChart.series, areaChart.scaleX.labels);
    areaChart.scaleY.values = getScaleYValues(maxValue);

    const lineChartsList: ZingData[] = [];
    if (this.chartWrapperService.total > 0) {
      lineChartsList.push(areaChart);
    } else {
      lineChartsList.push(ChartInitData.getLineAreaChartInitData());
    }
    return { graphset: lineChartsList };
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
