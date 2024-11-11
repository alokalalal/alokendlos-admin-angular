import { BlockUiTemplateComponent } from './../common/block-ui-template/block-ui-template.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { EmailAccountAddEditComponent } from './email-account/email-account-add-edit/email-account-add-edit.component';
import { EmailAccountListComponent } from './email-account/email-account-list/email-account-list.component';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { NotificationConfigurationComponent } from './notification-configuration/notification-configuration.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AppUrl } from 'src/app/constants/app-url';
import { ActiveClass } from 'src/app/constants/active-class';
import {MatMenuModule} from '@angular/material/menu';



@NgModule({
  declarations: [EmailAccountListComponent, EmailAccountAddEditComponent, NotificationConfigurationComponent],
  imports: [
    CommonModule,
    ApplicationCommonComponentModule,
    ErrorMessageModule,
    AppMaterialModule,
    ReactiveFormsModule,
    EditorModule,
    MatButtonToggleModule,
    MatMenuModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
  }),
    RouterModule.forChild([
     {
       path: '',
       children:[
         { path: AppUrl.NOTIFICATION_EMAIL_ACCOUNT + "/" + AppUrl.LIST_OPERATION, component: EmailAccountListComponent,canActivate: [AuthGuard], data: {title: 'Email Account List | Endlos', activeClass: ActiveClass.NOTIFICATION_EMAIL_ACCOUNT }},
         { path: AppUrl.NOTIFICATION_EMAIL_ACCOUNT + "/" + AppUrl.ADD_OPERATION, component: EmailAccountAddEditComponent,canActivate: [AuthGuard], data: {title: 'Email Account Add | Endlos', activeClass: ActiveClass.NOTIFICATION_EMAIL_ACCOUNT }},
         { path: AppUrl.NOTIFICATION_EMAIL_ACCOUNT + "/" + AppUrl.EDIT_OPERATION + ':id', component: EmailAccountAddEditComponent,canActivate: [AuthGuard], data: { title: 'Email Account Edit | Endlos', activeClass: ActiveClass.NOTIFICATION_EMAIL_ACCOUNT }},
        //  { path: 'view/:id', component: RoleAddEditComponent,canActivate: [AuthGuard], data: {title: 'Role View | Endlos', activeClass: 'Role' }}
         { path: AppUrl.NOTIFICATION_CONFIGURATION, component: NotificationConfigurationComponent,canActivate: [AuthGuard], data: {title: 'Notification Configuration | Endlos', activeClass: ActiveClass.NOTIFICATION_MANAGE }}
       ]
     }
    ])
  ]
})
export class NotificationModule { }
