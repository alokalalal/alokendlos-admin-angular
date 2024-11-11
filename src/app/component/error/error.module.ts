import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { RouterModule } from '@angular/router';
import { AppUrl } from 'src/app/constants/app-url';



@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          {path: AppUrl.INTERNAL_SERVER_ERROR, component: ErrorComponent},
          {path: AppUrl.PAGE_NOT_FOUND, component: ErrorComponent},
          {path: AppUrl.UNAUTHORIZED, component: ErrorComponent},
          {path: AppUrl.SERVICE_UNAVAILABLE, component: ErrorComponent},
          {path: AppUrl.FORBIDDEN, component: ErrorComponent},
          {path: AppUrl.BAD_GATEWAY, component: ErrorComponent},
          {path: AppUrl.BAD_REQUEST, component: ErrorComponent},
          {path: AppUrl.ERROR, component: ErrorComponent},
        ]
      }
    ])
  ]
})
export class ErrorModule { }
