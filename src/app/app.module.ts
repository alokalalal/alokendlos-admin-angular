import { BlockUiTemplateComponent } from './component/common/block-ui-template/block-ui-template.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BlockUIModule } from 'ng-block-ui';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app.material.module';
import { ChangePasswordComponent } from './component/user/change-password/change-password.component';
import { UserPublicModule } from './component/user/user-public.module';
import { LayoutModule } from './layout/layout.module';
import { AuthInterceptor } from './services/auth.interceptor';
import { ErrorMessageModule } from './shared/error/error-message/error-message.module';
import { PublicFooterComponent } from './shared/footer/public-footer.component';
import { AuthGuard } from './_guards/auth.guard';
import { MatChipsModule } from '@angular/material/chips';
import { AgmCoreModule } from '@agm/core';
import { ThemeService } from './services/app-theme.service';
import { ThemeTypeEnum, ThemeColorEnum } from './constants/theme-type.enum';
import { ZingChartModule } from './zing-chart/zing-chart.module';
import { BarcodeTemplateModule } from './component/barcode-template/barcode-template.module';

@NgModule({
  declarations: [
    AppComponent,
    PublicFooterComponent,
    ChangePasswordComponent,
    BlockUiTemplateComponent
    ],
  imports: [
    CommonModule,
    BrowserAnimationsModule, // required animations module
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BlockUIModule.forRoot({
      template : BlockUiTemplateComponent
    }),
    EditorModule,
    ImageCropperModule,
    LazyLoadImageModule,
    NgSelectModule,
    NgbModule,
    HttpClientModule,
    LayoutModule,
    UserPublicModule,
    AppMaterialModule,
    ErrorMessageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    MatChipsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDBtIyzoCRQEbChqHWWZwDctB1Rjnr3H4k',
    }),
    ZingChartModule,
    BarcodeTemplateModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [ BlockUiTemplateComponent ]
})
export class AppModule { 
  protected bodyElement!: HTMLElement;
  constructor(protected themeService: ThemeService) {
    this.bodyElement = document.getElementsByTagName("body")[0];
    themeService.getTheme().subscribe(data => {
      this.bodyElement.classList.forEach(className => {
        if(className.endsWith("-theme-type")){
          this.bodyElement.classList.remove(className);
        }
      });
      this.bodyElement.classList.add(data);
    });
    themeService.getThemeColor().subscribe(data => {
      this.bodyElement.classList.forEach(className => {
        if(className.endsWith("-theme")){
          this.bodyElement.classList.remove(className);
        }
      });
      this.bodyElement.classList.add(data);
    });
    themeService.currentThemeTypeSubject.next(ThemeTypeEnum.light);
    themeService.currentThemeColorSubject.next(ThemeColorEnum.blue);
  }
}
