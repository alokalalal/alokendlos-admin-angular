import { BlockUiTemplateComponent } from './../../component/common/block-ui-template/block-ui-template.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ReplacePipe } from 'src/app/pipe/replace.pipe';
import { SidebarComponent } from './sidebar.component';

@NgModule({
    declarations: [
        SidebarComponent,
        ReplacePipe
    ],
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
        SidebarComponent
    ],
    providers: []
})
export class SidebarModule { }