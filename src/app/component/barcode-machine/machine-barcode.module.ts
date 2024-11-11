import { BlockUiTemplateComponent } from '../common/block-ui-template/block-ui-template.component';
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
import { UserPrivateModule } from '../user/user-private.module';
import { MachineBarcodeListComponent } from './machine-barcode-list/machine-barcode-list.component';
import { MachineBarcodeAddEditComponent } from './machine-barcode-add-edit/machine-barcode-add-edit.component';
import { MachineBarcodeItemListComponent } from './machine-barcode-item-list/machine-barcode-item-list.component';

@NgModule({
  declarations: [MachineBarcodeListComponent, MachineBarcodeAddEditComponent, MachineBarcodeItemListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationCommonComponentModule,
    CustomerLocationModule,
    AppMaterialModule,
    ErrorMessageModule,
    UserPrivateModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: AppUrl.LIST_OPERATION, component: MachineBarcodeListComponent, canActivate: [AuthGuard], data: { title: 'Machine List | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } },
          { path: AppUrl.VIEW_OPERATION + ':id', component: MachineBarcodeItemListComponent, canActivate: [AuthGuard], data: { title: 'Machine View | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } }
          //{ path: AppUrl.VIEW_OPERATION + ':id', component: MachineBarcodeItemListComponent, canActivate: [AuthGuard], data: { title: 'BarcodeTemplate View | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } },        
          //([AppUrl.MACHINE_BARCODE + '/' + AppUrl.VIEW_OPERATION + '/' + barcodeMachineView.id])
        ]   
        
      }
    ])
  ]
})
export class MachineBarcodeModule { }
