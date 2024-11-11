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
import { BarcodeListComponent } from './barcode-list/barcode-list.component';


@NgModule({
  declarations: [BarcodeListComponent],
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
          {path: AppUrl.LIST_OPERATION, component: BarcodeListComponent, canActivate: [AuthGuard], data: {title: 'Barcode List | Endlos Admin', activeClass: ActiveClass.BARCODE}}
        ]
      }
    ])

  ]
})
export class BarcodeModule { }
