import { Component, Inject, OnInit } from '@angular/core';
import { CHART_WRAPPER_SERVICE, ChartWrapperService } from '../chart-services/chart-wrapper-service';

@Component({
  selector: 'app-chart-wrapper',
  templateUrl: './chart-wrapper.component.html'
})
export class ChartWrapperComponent implements OnInit {

  constructor(@Inject(CHART_WRAPPER_SERVICE) public chartWrapperService: ChartWrapperService) { }

  ngOnInit(): void {
  }

}
