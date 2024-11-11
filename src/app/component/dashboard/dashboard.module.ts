import { BlockUiTemplateComponent } from './../common/block-ui-template/block-ui-template.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { ActiveClass } from 'src/app/constants/active-class';
import { DashboardComponent } from './dashboard.component';
import { FullnessStatusComponent } from 'src/app/fullness-status/fullness-status.component';
import { TechnicalStatusComponent } from 'src/app/technical-status/technical-status.component';
import { PieChartComponent } from 'src/app/zing-chart/chart/pie-chart/pie-chart.component';
import { ZingChartModule } from 'src/app/zing-chart/zing-chart.module';


@NgModule({
  declarations: [DashboardComponent,FullnessStatusComponent,TechnicalStatusComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationCommonComponentModule,
    AppMaterialModule,
    ErrorMessageModule,
    ZingChartModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
  }),
    RouterModule.forChild([
      { 
        path: '', component: DashboardComponent, canActivate: [AuthGuard], data: {title: 'Dashboard | Endlos Admin', activeClass: ActiveClass.DASHBOARD}
      }
    ])

  ]
})
export class DashboardModule { }
