import { BlockUiTemplateComponent } from './../common/block-ui-template/block-ui-template.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ActiveClass } from 'src/app/constants/active-class';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { PickupRouteAddEditComponentComponent } from './pickup-route/pickup-route-add-edit-component/pickup-route-add-edit-component.component';
import { PickupRouteListOrCardComponentComponent } from './pickup-route/pickup-route-list-or-card-component/pickup-route-list-or-card-component.component';
import { DailyPickupAssigneeListComponent } from './daily-pickup-assignee/daily-pickup-assignee-list.component';
import { LogisticCurrentFullnesLogComponentComponent } from './logistic-current-fullnes-log-component/logistic-current-fullnes-log-component.component';
import { LogisticPickupLogsPerMachineComponentComponent } from './logistic-pickup-logs-per-machine-component/logistic-pickup-logs-per-machine-component.component';
import { LogisticPickupLogsPerRouteComponentComponent } from './logistic-pickup-logs-per-route-component/logistic-pickup-logs-per-route-component.component';
import { LogisticMaterialWeightComponentComponent } from './logistic-material-weight-component/logistic-material-weight-component.component';



@NgModule({
  declarations: [PickupRouteAddEditComponentComponent,DailyPickupAssigneeListComponent, PickupRouteListOrCardComponentComponent, LogisticCurrentFullnesLogComponentComponent, LogisticPickupLogsPerMachineComponentComponent, LogisticPickupLogsPerRouteComponentComponent, LogisticMaterialWeightComponentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationCommonComponentModule,
    AppMaterialModule,
    ErrorMessageModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
  }),
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: AppUrl.LIST_OPERATION, component: PickupRouteListOrCardComponentComponent, canActivate: [AuthGuard], data: { title: 'Pickup Route List | Endlos Admin', activeClass: ActiveClass.PICKUP_ROUTE } },
          { path: AppUrl.DAILY_PICKUP_ASSIGNEE + "/" + AppUrl.LIST_OPERATION, component: DailyPickupAssigneeListComponent, canActivate: [AuthGuard], data: { title: 'Daily Pickup Assignee List | Endlos Admin', activeClass: ActiveClass.PICKUP_ROUTE } },
          { path: AppUrl.CURRENT_FULLNESS_LOG, component: LogisticCurrentFullnesLogComponentComponent, canActivate: [AuthGuard], data: { title: 'Current Fullness Log | Endlos Admin', activeClass: ActiveClass.PICKUP_ROUTE } },
          { path: AppUrl.PICKUP_LOGS_PER_MACHINE, component: LogisticPickupLogsPerMachineComponentComponent, canActivate: [AuthGuard], data: { title: 'Pickup Logs Per Machine | Endlos Admin', activeClass: ActiveClass.PICKUP_ROUTE } },
          { path: AppUrl.PICKUP_LOGS_PER_ROUTE, component: LogisticPickupLogsPerRouteComponentComponent, canActivate: [AuthGuard], data: { title: 'Pickup Logs Per Route | Endlos Admin', activeClass: ActiveClass.PICKUP_ROUTE } },
          { path: AppUrl.LOGISTIC_MATERIAL_WEIGHT, component: LogisticMaterialWeightComponentComponent, canActivate: [AuthGuard], data: { title: 'Material Weight | Endlos Admin', activeClass: ActiveClass.PICKUP_ROUTE } },
        ]
      }
    ])

  ]
})
export class LogisticModule { }
