import { BlockUiTemplateComponent } from './../common/block-ui-template/block-ui-template.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { ActiveClass } from 'src/app/constants/active-class';
import { TransactionLogComponent } from './transaction-log-list/transaction-log.component';
import { TransactionModule } from './transaction.module';


@NgModule({
  imports: [
    TransactionModule,
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
          {path: AppUrl.LIST_OPERATION, component: TransactionListComponent, canActivate: [AuthGuard], data: {title: 'Customer List | Endlos Admin', activeClass: ActiveClass.TRANSACTION}}
        ]
      }
    ])

  ]
})
export class TransactionRoutingModule { }
