import { BlockUiTemplateComponent } from './../common/block-ui-template/block-ui-template.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { NgOtpInputModule } from 'ng-otp-input';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ActiveClass } from 'src/app/constants/active-class';
import { AppUrl } from 'src/app/constants/app-url';
import { LoginService } from 'src/app/services/login.service';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { PublicChangePasswordComponent } from './public-change-password/public-change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [
    ResetPasswordComponent,
    LoginComponent,
    ForgotPasswordComponent,
    OtpVerificationComponent,
    PublicChangePasswordComponent
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
    RouterModule.forChild([
        { path: '', redirectTo: 'login', pathMatch: 'full'},
        { path: AppUrl.LOGIN, component: LoginComponent, data: { title: 'Sign In | Endlos', activeClass: ActiveClass.USER } },
        { path: AppUrl.FORGOT_PASSWORD, component: ForgotPasswordComponent, data: { title: 'Forgot Password | Endlos', activeClass: ActiveClass.USER } },
        { path: AppUrl.OTP_VERIFICATION, component: OtpVerificationComponent, data: { title: 'OTP Verification | Endlos', activeClass: ActiveClass.USER } },
        { path: AppUrl.RESET_PASSWORD_VERIFICATION, component: ResetPasswordComponent, data: { title: 'Reset Password | Endlos', activeClass: ActiveClass.USER } },
        { path: AppUrl.FIRST_TIME_CHANGE_PASSWORD, component: PublicChangePasswordComponent, data: { title: 'Change Password | Endlos', activeClass: ActiveClass.USER } },
          // { path: '**', redirectTo: AppUrl.LOGIN }
        ]),
  ],
  exports: [],
  providers: [
    LoginService
  ]
})
export class UserPublicModule { }
