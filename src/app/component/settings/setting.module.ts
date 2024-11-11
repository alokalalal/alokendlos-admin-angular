import { BlockUiTemplateComponent } from './../common/block-ui-template/block-ui-template.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppUrl } from 'src/app/constants/app-url';
import { SystemSettingComponent } from './system-setting/system-setting.component';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { BlockUIModule } from 'ng-block-ui';
import { PasswordPolicyComponent } from './password-policy/password-policy.component';
import { SecurityPolicyComponent } from './security-policy/security-policy.component';
import { ActiveClass } from 'src/app/constants/active-class';
import { SystemSpecificationDetailListComponent } from '../system-specification-detail/system-specification-detail-list/system-specification-detail-list.component';

@NgModule({
  declarations: [SystemSettingComponent,
                PasswordPolicyComponent,
              SecurityPolicyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    ErrorMessageModule,
    NgSelectModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
  }),
    RouterModule.forChild([
      {
        path: '',
        children: [
        {path: AppUrl.SETTING, component: SystemSettingComponent, canActivate: [AuthGuard], data: {title: 'System Settings | Endlos', activeClass: ActiveClass.SETTING}},
        {path: AppUrl.PASSWORD_POLICY, component: PasswordPolicyComponent, canActivate: [AuthGuard], data: {title: 'Password Policy | Endlos', activeClass: ActiveClass.SYSTEM_PASSWORD_POLICY }},
        {path: AppUrl.SECURITY_POLICY, component: SecurityPolicyComponent, canActivate: [AuthGuard], data: {title: 'Security Policy | Endlos', activeClass: ActiveClass.SYSTEM_SECURITY_POLICY }},
        {path: AppUrl.SYSTEM_SPECIFICATION_DETAIL, component: SystemSpecificationDetailListComponent, canActivate: [AuthGuard], data: {title: 'System Specification Detail | Endlos', activeClass: ActiveClass.SYSTEM_SPECIFICATION_DETAIL }}
      ]}
    ]),
  ],
})
export class SettingModule { }
