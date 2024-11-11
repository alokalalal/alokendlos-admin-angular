import { BypassSecurityTrustResourceUrl } from './../../pipe/bypass-security-trust-resource-url';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppMaterialModule } from 'src/app/app.material.module';
import { CardOrListViewComponent } from './card-or-list-view/card-or-list-view.component';
import { CardItemDirective } from './card-or-list-view/directive/card-item.directive';
import { ListItemDirective } from './card-or-list-view/directive/list-item.directive';
import { InfiniteScrollComponent } from './card-or-list-view/infinite-scroll/infinite-scroll.component';
import { FullTextSearchComponent } from './full-text-search/full-text-search.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ListContainerFilterComponent } from './list-container-filter/list-container-filter.component';
import { ListComponent } from './list/list.component';
import { SearchableDropdownComponent } from './searchable-dropdown/searchable-dropdown.component';
import { TableComponent } from './table/table.component';
import { ListOrderComponent } from './card-or-list-view/list-order/list-order.component';

@NgModule({
    declarations: [
        ListComponent,
        FullTextSearchComponent,
        ListContainerFilterComponent,
        TableComponent,
        ImageCropperComponent,
        CardOrListViewComponent,
        CardItemDirective,
        ListItemDirective,
        SearchableDropdownComponent,
        InfiniteScrollComponent,
        ListOrderComponent,
        BypassSecurityTrustResourceUrl
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AppMaterialModule,
        ImageCropperModule,
        MatButtonToggleModule,
        MatMenuModule,
        BlockUIModule.forRoot()
    ],
    exports: [
        ListComponent,
        TableComponent,
        FullTextSearchComponent,
        ListContainerFilterComponent,
        ImageCropperComponent,
        CardOrListViewComponent,
        CardItemDirective,
        ListItemDirective,
        SearchableDropdownComponent,
        InfiniteScrollComponent,
        ListOrderComponent,
        BypassSecurityTrustResourceUrl
    ]
})
export class ApplicationCommonComponentModule { }
