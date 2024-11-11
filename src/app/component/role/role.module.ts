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
import { RoleAddEditComponent } from './role-add-edit/role-add-edit.component';
import { RoleListComponent } from './role-list/role-list.component';



@NgModule({
  declarations: [RoleListComponent, RoleAddEditComponent],
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
       children:[
         { path: AppUrl.LIST_OPERATION, component: RoleListComponent,canActivate: [AuthGuard], data: { title: 'Role List | Endlos', activeClass: ActiveClass.ROLE }},
         { path: AppUrl.ADD_OPERATION, component: RoleAddEditComponent,canActivate: [AuthGuard], data: {title: 'Role Add | Endlos', activeClass: ActiveClass.ROLE }},
         { path: AppUrl.EDIT_OPERATION + ':id', component: RoleAddEditComponent,canActivate: [AuthGuard], data: {title: 'Role Edit | Endlos', activeClass: ActiveClass.ROLE }},
         //  { path: 'view/:id', component: RoleAddEditComponent,canActivate: [AuthGuard], data: {title: 'Role View | Endlos', activeClass: ActiveClass.ROLE }}
       ]
     }
    ])
  ]
})
export class RoleModule { }
