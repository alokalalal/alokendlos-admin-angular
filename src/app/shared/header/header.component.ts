import { ThemeColorEnum } from './../../constants/theme-type.enum';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { ChangePasswordComponent } from 'src/app/component/user/change-password/change-password.component';
import { AppUrl } from 'src/app/constants/app-url';
import { MenuConfigInterface } from 'src/app/Interface/menu-config-interface';
import { ThemeService } from 'src/app/services/app-theme.service';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  appUrl = AppUrl;
  public darkThemeEnabledCtrl = new FormControl(false);
  selectedTheme = Object.values(ThemeColorEnum)[0];
  @ViewChild('changePasswordContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;

  @Input() menuArray: Array<MenuConfigInterface> = new Array<MenuConfigInterface>();
  @Input() isSidebarOpen: boolean = false;
  @Output() openCloseSidebar: EventEmitter<boolean> =   new EventEmitter();

  themeColorEnum = ThemeColorEnum;

  constructor(
    private loginService: LoginService,
    private sharedService: SharedService,
    private router: Router,
    private snackBarService: SnackBarService,
    private cdRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private currentUserStoreService: CurrentUserStoreService,
    protected themeService: ThemeService,
  ) {
   }

  ngOnInit(): void {
    this.darkThemeEnabledCtrl.valueChanges.subscribe((toggleValue : boolean) => {
      this.themeService.toggleTheme();
    });
  }


  openChangePasswordModal(){
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChangePasswordComponent);
      const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
      componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isComponentDestroy: boolean)=>{
        if(isComponentDestroy){
          this.dynamicComponentContainer.detach();
        }
      });
  }
  
  changeSidebarStatus(){
    this.isSidebarOpen = !this.isSidebarOpen;
    this.openCloseSidebar.emit(this.isSidebarOpen);
  }

  doLogout() {
    if (this.currentUserStoreService.getCurrentUser() != undefined && this.currentUserStoreService.getCurrentUser().id != undefined && this.currentUserStoreService.getCurrentUser().id != 0) {
      this.loginService.doLogout().subscribe(response => {
        if (response != undefined && response.code != undefined) {
          if (response.code >= 1000 && response.code < 2000) {
            this.sharedService.clearSession();
            this.snackBarService.successSnackBar(response.message)
            this.router.navigate([this.appUrl.USER + '/' + this.appUrl.LOGIN])
            this.cdRef.detectChanges();

            localStorage.removeItem('filterCustomer');
            localStorage.removeItem('filterLocation');
            localStorage.removeItem('filterMachine');
            localStorage.removeItem('filterStartDate');
            localStorage.removeItem('filterEndDate');
          } else {
            this.snackBarService.errorSnackBar(response.message)
          }
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      })
    } else {
      this.sharedService.clearSession();
    }
  }

  changeThemeColor(theme: any){
      this.themeService.changeThemeColor(theme.value);
  }
}
