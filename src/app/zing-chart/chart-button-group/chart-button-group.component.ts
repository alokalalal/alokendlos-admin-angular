import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ChartQuery, ChartService } from '../akita/chart';
import { ChartWrapperService, CHART_WRAPPER_SERVICE } from '../chart-services/chart-wrapper-service';
import { Constants } from '../constants';
import { ChartButtonGroupSetup, ChartTypeSelector, DrillDownStatus } from '../interface';

@Component({
  selector: 'app-chart-button-group',
  templateUrl: './chart-button-group.component.html',
  styleUrls: ['./chart-button-group.component.scss']
})
export class ChartButtonGroupComponent implements OnInit {
  public chartButtonGroup: ChartButtonGroupSetup;
  chartTypeSelector$: Observable<ChartTypeSelector>;
  drillDownStatus$: Observable<DrillDownStatus>;
  aggregate$: Observable<boolean>;

  constructor(
      @Inject(CHART_WRAPPER_SERVICE) public chartWrapperService: ChartWrapperService,
      private chartService: ChartService,
      private chartQuery: ChartQuery
  ) {}

  ngOnInit() {
      this.chartButtonGroup = this.chartWrapperService.getChartButtonGroupConfig();
      const id = this.chartWrapperService.getChartEntityId();
      this.chartTypeSelector$ = this.chartQuery.getChartTypeSelectorObservable(id);
      this.drillDownStatus$ = this.chartQuery.getDrillDownObservable(id);
      this.aggregate$ = this.chartQuery.getAggregateObservable(id);
}

  toggleAggregate() {
      this.chartButtonGroup.menuButton.aggregateSection.isSelected = !this.chartButtonGroup.menuButton.aggregateSection.isSelected;
      this.chartWrapperService.setAggregateStatus(this.chartButtonGroup.menuButton.aggregateSection.isSelected);
  }

  toggleLegend() {
      this.chartButtonGroup.menuButton.legendSection.isSelected = !this.chartButtonGroup.menuButton.legendSection.isSelected;
      this.chartService.updateLegendSection(this.chartWrapperService.getChartEntityId());
  }

  toggleTotal() {
      this.chartButtonGroup.menuButton.totalSection.isSelected = !this.chartButtonGroup.menuButton.totalSection.isSelected;
      this.chartWrapperService.setShowTotalStatus(this.chartButtonGroup.menuButton.totalSection.isSelected);
  }

  changeChartTypeSelector(chartTypeSelector) {
      this.chartWrapperService.setChartTypeSelector(chartTypeSelector);
  }

  removeDrillDown() {
      const chartTypeSelector: ChartTypeSelector = _.find(
          Constants.chartTypeSelectors,
          (c: ChartTypeSelector) => c.type === this.chartWrapperService.getChartEntity().drillDownStatus?.lastSelectedChartType
      );
      this.chartService.updateDrillDownStatus(this.chartWrapperService.getChartEntityId(), null, chartTypeSelector, true);
  }
}
