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
import { SuperAdminAddEditComponent } from './super-admin-add-edit/super-admin-add-edit.component';
import { SuperAdminListComponent } from './super-admin-list/super-admin-list.component';

@NgModule({
  declarations: [SuperAdminListComponent,SuperAdminAddEditComponent],
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
          {path: AppUrl.LIST_OPERATION, component: SuperAdminListComponent, canActivate: [AuthGuard], data: {title: 'Super Admin List | Endlos Admin', activeClass: ActiveClass.SUPER_ADMIN}},
        ]
      }
    ])

  ]
})
export class SuperAdminModule { }
