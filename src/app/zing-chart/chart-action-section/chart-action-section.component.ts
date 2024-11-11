import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartQuery } from '../akita/chart';
import { CHART_WRAPPER_SERVICE, ChartWrapperService } from '../chart-services/chart-wrapper-service';
import { ChartActionSectionSetup, ChartFilter } from '../interface';

@Component({
  selector: 'app-chart-action-section',
  templateUrl: './chart-action-section.component.html',
  styleUrls: ['./chart-action-section.component.scss']
})
export class ChartActionSectionComponent implements OnInit {
  chartActionSection: ChartActionSectionSetup;
  public filter$: Observable<ChartFilter>;

  constructor(@Inject(CHART_WRAPPER_SERVICE) public chartWrapperService: ChartWrapperService, private chartQuery: ChartQuery) {}

  ngOnInit(): void {
      this.chartActionSection = this.chartWrapperService.getChartActionSectionConfig();
      this.filter$ = this.chartQuery.getFilterObservable(this.chartWrapperService.getChartEntityId());
  }
}
