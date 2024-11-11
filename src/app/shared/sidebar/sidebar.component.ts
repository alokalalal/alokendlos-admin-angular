import { UserView } from './../../view/common/user-view';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { AppUrl } from 'src/app/constants/app-url';
import { MenuConfigInterface } from 'src/app/Interface/menu-config-interface';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() menuArray: Array<MenuConfigInterface> = new Array<MenuConfigInterface>();
  @Input() isSidebarOpen!: boolean;
  public appUrl = AppUrl;
  public hasCurrentUser: boolean = false;
  public loggedInUser: UserView = new UserView();

  constructor(
    private loginService: LoginService,
    private sharedService: SharedService,
    private router: Router,
    private snackBarService: SnackBarService,
    private cdRef: ChangeDetectorRef,
    private currentUserStoreService: CurrentUserStoreService
  ) {

  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        if (this.currentUserStoreService.getCurrentUser() != undefined && this.currentUserStoreService.getCurrentUser().id != undefined && this.currentUserStoreService.getCurrentUser().id != 0) {
          this.hasCurrentUser = true;
          this.loggedInUser = this.currentUserStoreService.getCurrentUser()
        } else {
          this.hasCurrentUser = false;
          this.cdRef.detectChanges();
        }
      }
    });
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

}
