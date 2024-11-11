import { BlockUiTemplateComponent } from './../common/block-ui-template/block-ui-template.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { NgOtpInputModule } from 'ng-otp-input';
import { AppMaterialModule } from 'src/app/app.material.module';
import { LoginService } from 'src/app/services/login.service';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { PrivateChangePasswordComponent } from './private-change-password/private-change-password.component';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailViewComponent } from './user-detail-view/user-detail-view.component';



@NgModule({
  declarations: [
    UserListComponent,
    UserAddEditComponent,
    PrivateChangePasswordComponent,
    UserDetailViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationCommonComponentModule,
    AppMaterialModule,
    NgOtpInputModule,
    ErrorMessageModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
    }),
  ],
  exports: [UserListComponent],
  providers: [
    LoginService
  ]
})
export class UserPrivateModule { }
