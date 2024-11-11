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
import { MachineAddEditComponent } from './machine-add-edit/machine-add-edit.component';
import { MachineDetailViewComponent } from './machine-detail-view/machine-detail-view.component';
import { MachineListOrCardComponent } from './machine-list-or-card/machine-list-or-card.component';
import { AssignToCustomerComponent } from './assign-to-customer/assign-to-customer.component';
import { TransactionListComponent } from '../transaction/transaction-list/transaction-list.component';
import { TransactionModule } from '../transaction/transaction.module';
import { ErrorListModule } from '../machine-error/error-list/error-list.module';
import { MachineLogListModule } from '../machine-log-list/machine-log-list.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MachineCapacityListModule } from '../machine-capacity/machine-capacity-list.module';
import { MqttConfigurationView } from 'src/app/entities/mqtt-configuration-view';
import { MQTTConfigurationListModule } from '../mqtt-configuration-list/mqtt-configuration-list.module';
import { PLCConfigurationListModule } from '../plc-configuration-list/plc-configuration-list.module';
import { LocationHistoryListModule } from './location-history-component/location-history-list.module';



@NgModule({
  declarations: [MachineAddEditComponent, MachineDetailViewComponent, MachineListOrCardComponent, AssignToCustomerComponent],
  imports: [
    TransactionModule,
    ErrorListModule,
    MachineLogListModule,
    MachineCapacityListModule,
    MQTTConfigurationListModule,
    PLCConfigurationListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationCommonComponentModule,
    AppMaterialModule,
    ErrorMessageModule,
    MatButtonToggleModule,
    LocationHistoryListModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
  }),
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: AppUrl.LIST_OPERATION, component: MachineListOrCardComponent, canActivate: [AuthGuard], data: { title: 'Machine List | Endlos Admin', activeClass: ActiveClass.MACHINE } },
          { path: AppUrl.VIEW_OPERATION + ':id', component: MachineDetailViewComponent, canActivate: [AuthGuard], data: { title: 'Machine View | Endlos Admin', activeClass: ActiveClass.MACHINE } },
        ]
      }
    ])

  ]
})
export class MachineModule { }
