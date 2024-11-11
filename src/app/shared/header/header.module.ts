import { BlockUiTemplateComponent } from './../../component/common/block-ui-template/block-ui-template.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ErrorMessageModule } from '../error/error-message/error-message.module';
import { HeaderComponent } from './header.component';
@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BlockUIModule.forRoot({
            template : BlockUiTemplateComponent
        }),
        RouterModule,
        LazyLoadImageModule,
        AppMaterialModule,
        ErrorMessageModule
    ],
    exports: [
        HeaderComponent
    ],
    providers: []
})
export class HeaderModule { }