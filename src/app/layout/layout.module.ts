import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app.material.module';
import { FooterModule } from '../shared/footer/footer.module';
import { HeaderModule } from '../shared/header/header.module';
import { SidebarModule } from '../shared/sidebar/sidebar.module';
import { PrivateLayoutComponent } from './private-layout/private-layout.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';



@NgModule({
  declarations: [PrivateLayoutComponent, PublicLayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    RouterModule,
    SidebarModule,
    FooterModule,
    AppMaterialModule
  ],
  exports:[
    PrivateLayoutComponent, PublicLayoutComponent
  ]
})
export class LayoutModule { }
