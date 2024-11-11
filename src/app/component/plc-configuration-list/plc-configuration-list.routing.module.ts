import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { ActiveClass } from 'src/app/constants/active-class';
import { BlockUiTemplateComponent } from '../common/block-ui-template/block-ui-template.component';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { PLCConfigurationListComponent } from './plc-configuration-list.component';
import { PLCConfigurationListModule } from './plc-configuration-list.module';

@NgModule({
  imports: [
    PLCConfigurationListModule,
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
          {path: AppUrl.LIST_OPERATION, component: PLCConfigurationListComponent, canActivate: [AuthGuard], data: {title: 'Machine Log List | Endlos Admin', activeClass: ActiveClass.PLC_CONFIGURATION}}
        ]
      }
    ])

  ]
})
export class PLCConfigurationListRoutingModule { }
