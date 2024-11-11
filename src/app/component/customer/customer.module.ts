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
import { CustomerLocationModule } from '../customer-location/customer-location.module';
import { CustomerAddEditComponent } from './customer-add-edit/customer-add-edit.component';
import { CustomerDetailViewComponent } from './customer-detail-view/customer-detail-view.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { UserPrivateModule } from '../user/user-private.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [CustomerListComponent,CustomerAddEditComponent, CustomerDetailViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationCommonComponentModule,
    CustomerLocationModule,
    AppMaterialModule,
    ErrorMessageModule,
    UserPrivateModule,
    MatButtonToggleModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: '',
        children: [
          {path: AppUrl.LIST_OPERATION, component: CustomerListComponent, canActivate: [AuthGuard], data: {title: 'Customer List | Endlos Admin', activeClass: ActiveClass.CUSTOMER}},
          { path: AppUrl.VIEW_OPERATION + ':id', component: CustomerDetailViewComponent, canActivate: [AuthGuard], data: { title: 'Customer View | Endlos Admin', activeClass: ActiveClass.CUSTOMER } },
        ]
      }
    ])

  ]
})
export class CustomerModule { }
