import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { BlockUIModule } from 'ng-block-ui';
import { ApplicationCommonComponentModule } from '../../common/application.common.component.module';
import { BlockUiTemplateComponent } from '../../common/block-ui-template/block-ui-template.component';
import { LocationHistoryComponentComponent } from './location-history-component.component';

@NgModule({
  declarations: [LocationHistoryComponentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationCommonComponentModule,
    AppMaterialModule,
    ErrorMessageModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
  })
  ],
  exports: [
    LocationHistoryComponentComponent
],
})
export class LocationHistoryListModule { }
