import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportListComponent } from './report-list/report-list.component';
import { RouterModule } from '@angular/router';
import { AppUrl } from 'src/app/constants/app-url';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { ActiveClass } from 'src/app/constants/active-class';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { AppMaterialModule } from 'src/app/app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUiTemplateComponent } from '../common/block-ui-template/block-ui-template.component';



@NgModule({
  declarations: [
    ReportListComponent
  ],
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
         { path: AppUrl.LIST_OPERATION, component: ReportListComponent,canActivate: [AuthGuard], data: {title: 'Report List | Endlos', activeClass: ActiveClass.REPORT }},
       ]
     }
    ])
  ]
})
export class ReportModule { }
