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
import { MachineErrorTypeListComponent } from './machine-error-type-list/machine-error-type-list.component';
import { MachineErrorTypeAddEditComponent } from './machine-error-type-add-edit/machine-error-type-add-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [MachineErrorTypeListComponent, MachineErrorTypeAddEditComponent],
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
    MatFormFieldModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: AppUrl.LIST_OPERATION, component: MachineErrorTypeListComponent, canActivate: [AuthGuard], data: { title: 'Customer List | Endlos Admin', activeClass: ActiveClass.MACHINE_ERROR_TYPE } },
        ]
      }
    ])

  ]
})
export class MachineErrorTypeModule { }
