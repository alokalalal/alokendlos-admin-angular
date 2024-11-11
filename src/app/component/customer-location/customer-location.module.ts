import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ErrorMessageModule } from 'src/app/shared/error/error-message/error-message.module';
import { ApplicationCommonComponentModule } from '../common/application.common.component.module';
import { CustomerLocationAddEditComponent } from './customer-location-add-edit/customer-location-add-edit.component';
import { CustomerLocationListComponent } from './customer-location-list/customer-location-list.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
    declarations: [CustomerLocationAddEditComponent, CustomerLocationListComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ApplicationCommonComponentModule,
        AppMaterialModule,
        ErrorMessageModule,
        BlockUIModule.forRoot(),
        AgmCoreModule,
    ],
    exports: [CustomerLocationListComponent]
})
export class CustomerLocationModule { }
