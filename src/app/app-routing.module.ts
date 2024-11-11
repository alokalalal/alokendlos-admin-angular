import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppUrl } from './constants/app-url';
import { PrivateLayoutComponent } from './layout/private-layout/private-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { LoginService } from './services/login.service';

const routes: Routes = [
  //Site routes goes here 
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: AppUrl.USER, loadChildren: () => import('../app/component/user/user-public.module').then(m => m.UserPublicModule), resolve: { resolveValue: LoginService } },
      { path: AppUrl.ERROR, loadChildren: () => import('../app/component/error/error.module').then(m => m.ErrorModule) }
    ]
  }, {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      { path: AppUrl.DASHBOARD,loadChildren: () => import('../app/component/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: AppUrl.USER, loadChildren: () => import('../app/component/user/user-routing-module').then(m => m.UserRoutingModule) },
      { path: AppUrl.SUPER_ADMIN, loadChildren: () => import('../app/component/super-admin/super-admin.module').then(m => m.SuperAdminModule) },
      { path: AppUrl.CUSTOMER, loadChildren: () => import('../app/component/customer/customer.module').then(m => m.CustomerModule) },
      { path: AppUrl.CUSTOMER_LOCATION, loadChildren: () => import('../app/component/customer-location/customer-location.module').then(m => m.CustomerLocationModule) },
      { path: AppUrl.ROLE, loadChildren: () => import('../app/component/role/role.module').then(m => m.RoleModule) },
      { path: AppUrl.NOTIFICATION, loadChildren: () => import('../app/component/notification/notification.module').then(m => m.NotificationModule) },
      { path: AppUrl.SETTING, loadChildren: () => import('../app/component/settings/setting.module').then(m => m.SettingModule) },
      { path: AppUrl.MACHINE, loadChildren: () => import('../app/component/machine/machine.module').then(m => m.MachineModule) },
      { path: AppUrl.MACHINE_ERROR_TYPE, loadChildren: () => import('../app/component/machine-error-type/machine-error-type.module').then(m => m.MachineErrorTypeModule) },
      { path: AppUrl.TRANSACTION, loadChildren: () => import('../app/component/transaction/transaction.routing.module').then(m => m.TransactionRoutingModule) },
      { path: AppUrl.BARCODE, loadChildren: () => import('../app/component/barcode/barcode.module').then(m => m.BarcodeModule) },
      { path: AppUrl.BARCODE_TEMPLATE, loadChildren: () => import('../app/component/barcode-template/barcode-template.module').then(m => m.BarcodeTemplateModule) },
      { path: AppUrl.ERROR_LIST, loadChildren: () => import('../app/component/machine-error/error-list/error-list.routing.module').then(m => m.ErrorListRoutingModule) },
      { path: AppUrl.CHANGE_LOCATION, loadChildren: () => import('../app/component/change-location/change-location.module').then(m => m.ChangeLocationModule) },
      { path: AppUrl.REPORT, loadChildren: () => import('../app/component/report/report.module').then(m => m.ReportModule) },
      { path: AppUrl.MACHINE_LOG, loadChildren: () => import('../app/component//machine-log-list/machine-log-list.routing.module').then(m => m.MachineLogListRoutingModule) },
      { path: AppUrl.MACHINE_CAPACITY, loadChildren: () => import('../app/component/machine-capacity/machine-capacity-list.routing.module').then(m => m.MachineCapacityListRoutingModule) },
      { path: AppUrl.MQTT_CONFIGURATION, loadChildren: () => import('../app/component/mqtt-configuration-list/mqtt-configuration-list.routing.module').then(m => m.MQTTConfigurationListRoutingModule) },
      { path: AppUrl.PLC_CONFIGURATION, loadChildren: () => import('../app/component/plc-configuration-list/plc-configuration-list.routing.module').then(m => m.PLCConfigurationListRoutingModule) },
      { path: AppUrl.MACHINE_BARCODE,loadChildren: () => import('../app/component/barcode-machine/machine-barcode.module').then(m => m.MachineBarcodeModule) },
      { path: AppUrl.PICKUP_ROUTE,loadChildren: () => import('../app/component/logistic/logistic.module').then(m => m.LogisticModule) },
      { path: AppUrl.SYSTEM_SPECIFICATION_DETAIL,loadChildren: () => import('../app/component/system-specification-detail/system-specification-detail.module').then(m => m.SystemSpecificationDetailModule) },
    ]
  },
  // App routes goes here here

  { path: '**', redirectTo: AppUrl.DASHBOARD }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 100],
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
