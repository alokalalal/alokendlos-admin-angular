import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeLocationListComponent } from './change-location-list/change-location-list.component';
import { ChangeLocationAddEditComponent } from './change-location-add-edit/change-location-add-edit.component';
import { RouterModule } from '@angular/router';
import { AppUrl } from 'src/app/constants/app-url';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { ActiveClass } from 'src/app/constants/active-class';
import { AppMaterialModule } from 'src/app/app.material.module';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUiTemplateComponent } from '../common/block-ui-template/block-ui-template.component';
import { TransactionModule } from '../transaction/transaction.module';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { ErrorListModule } from '../machine-error/error-list/error-list.module';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChangeLocationListComponent,
    ChangeLocationAddEditComponent,
  ],
  imports: [
    CommonModule,
    ApplicationCommonComponentModule,
    AppMaterialModule,
    ErrorListModule,
    ErrorMessageModule,
    FormsModule,
    TransactionModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: AppUrl.LIST_OPERATION, component: ChangeLocationListComponent, canActivate: [AuthGuard], data: { title: 'ChangeLocation List | Endlos Admin', activeClass: ActiveClass.CHANGE_LOCATION } },
          // { path: AppUrl.ADD_OPERATION, component: ChangeLocationAddEditComponent, canActivate: [AuthGuard], data: { title: 'ChangeLocation Add | Endlos Admin', activeClass: ActiveClass.CHANGE_LOCATION } },
        ]       
      }
    ])
  ]
})

export class ChangeLocationModule { }
