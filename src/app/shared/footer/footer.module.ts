import { BlockUiTemplateComponent } from './../../component/common/block-ui-template/block-ui-template.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FooterComponent } from './footer.component';
import { PublicFooterComponent } from './public-footer.component';

@NgModule({
declarations: [FooterComponent],
imports: [
CommonModule,
FormsModule,
ReactiveFormsModule,
BlockUIModule.forRoot({
    template : BlockUiTemplateComponent
}),
RouterModule,
LazyLoadImageModule
],
exports: [
    FooterComponent
],
providers: []
})
export class FooterModule { }