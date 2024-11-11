import { BarcodeTemplateViewComponent } from './barcode-template-view/barcode-template-view.component';
import { BarcodeStructureAddEditComponent } from './barcode-structure/barcode-structure-add-edit/barcode-structure-add-edit.component';
import { BarcodeStructureListComponent, ChangeCheckboxColorDirective } from './barcode-structure/barcode-structure-list/barcode-structure-list.component';
import { BarcodeTemplateListComponent } from './barcode-template-list/barcode-template-list.component';
import { BarcodeTemplateAddEditComponent } from './barcode-template-add-edit/barcode-template-add-edit.component';
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
import { AssignBarcodeComponent } from './assign-barcode/assign-barcode.component';


@NgModule({
  declarations: [BarcodeTemplateAddEditComponent,BarcodeTemplateListComponent,BarcodeStructureListComponent,BarcodeStructureAddEditComponent, ChangeCheckboxColorDirective, AssignBarcodeComponent,BarcodeTemplateViewComponent ],
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
          { path: AppUrl.LIST_OPERATION, component: BarcodeTemplateListComponent, canActivate: [AuthGuard], data: { title: 'BarcodeTemplate List | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } },
          { path: AppUrl.ADD_OPERATION, component: BarcodeTemplateAddEditComponent, canActivate: [AuthGuard], data: { title: 'BarcodeTemplate Add | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } },
          { path: AppUrl.EDIT_OPERATION + ':id', component: BarcodeTemplateAddEditComponent, canActivate: [AuthGuard], data: { title: 'BarcodeTemplate Edit | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } },   
          { path: AppUrl.VIEW_OPERATION + ':id', component: BarcodeTemplateViewComponent, canActivate: [AuthGuard], data: { title: 'BarcodeTemplate View | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } },        
          { path: AppUrl.LIST_OPERATION, component: BarcodeStructureListComponent, canActivate: [AuthGuard], data: { title: 'BarcodeStructure List | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } },
          { path: AppUrl.LIST_OPERATION, component: BarcodeStructureAddEditComponent, canActivate: [AuthGuard], data: { title: 'BarcodeStructure AddEdit | Endlos Admin', activeClass: ActiveClass.BARCODE_TEMPLATE } },
          { path: AppUrl.ASSIGN_BARCODE + "/" + AppUrl.LIST_OPERATION, component: AssignBarcodeComponent,canActivate: [AuthGuard], data: {title: 'Assign Barcode | Endlos', activeClass: ActiveClass.BARCODE_TEMPLATE},}
        ]       
      }
    ])

  ]
})
export class BarcodeTemplateModule { }