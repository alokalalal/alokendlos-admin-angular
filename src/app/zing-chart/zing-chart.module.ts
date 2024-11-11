import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZingchartAngularModule } from 'zingchart-angular';
import { ChartActionSectionComponent } from './chart-action-section/chart-action-section.component';
import { ChartButtonGroupComponent } from './chart-button-group/chart-button-group.component';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { ChartWrapperComponent } from './chart-wrapper/chart-wrapper.component';
import { ColumnChartComponent } from './chart/column-chart/column-chart.component';
import { LineAreaChartComponent } from './chart/line-area-chart/line-area-chart.component';
import { PieChartComponent } from './chart/pie-chart/pie-chart.component';


const routes: Routes = [];
@NgModule({
  declarations: [
    ChartWrapperComponent,
    ChartButtonGroupComponent,
    ChartLegendComponent,
    ChartActionSectionComponent,
    ColumnChartComponent,
    LineAreaChartComponent,
    PieChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ZingchartAngularModule
  ],
  exports:[
    ChartWrapperComponent,
    ColumnChartComponent,
    LineAreaChartComponent,
    PieChartComponent
  ]
})
export class ZingChartModule { }
