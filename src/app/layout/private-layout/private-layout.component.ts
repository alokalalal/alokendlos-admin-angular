import { UserView } from './../../view/common/user-view';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { MenuConfigInterface } from 'src/app/Interface/menu-config-interface';
import CommonUtility from 'src/app/utility/common.utility';
import { PublicLayoutComponent } from '../public-layout/public-layout.component';
import { PrivateMenuMaster } from './../../constants/private-menu-master';

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.scss']
})
export class PrivateLayoutComponent implements OnInit {
  @Input() isSidebarOpen!: boolean;

  public menuArray = new Array<MenuConfigInterface>();
  public headerMenuArray = new Array<MenuConfigInterface>();
  public activeClass = "";
  public currentUser: UserView = new UserView();
  public privateMenuMaster = JSON.parse(JSON.stringify(PrivateMenuMaster));

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private currentUserStoreService: CurrentUserStoreService
  ) {
    this.currentUser = this.currentUserStoreService.getCurrentUser();
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        if (event.snapshot.component != PublicLayoutComponent
          && event.snapshot.component != PrivateLayoutComponent
          && event.snapshot.data != undefined && event.snapshot.data.activeClass != undefined) {
          this.activeClass = event.snapshot.data.activeClass;
          this.headerMenuArray = this.prepareHeaderMenu();
          this.cdRef.detectChanges();
        }
      }
    });
  }

  ngOnInit(): void {
    this.menuArray = this.prepareMenu();
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
    //     if (LocalStorageUtility.getLocalStorage(LocalStorageKey.currentUser)) {
    //       if (LocalStorageUtility.getLocalStorage(LocalStorageKey.currentUser)) {
    //         this.currentUser = JSON.parse(String(LocalStorageUtility.getLocalStorage(LocalStorageKey.currentUser)));
    //         this.cdRef.detectChanges();
    //       }
    //     } else {
    //       this.currentUser = new User(UserTemplate);
    //       this.cdRef.detectChanges();
    //     }
    //   }
    // });
  }
  prepareHeaderMenu(): Array<MenuConfigInterface> {
    var tempMenu = new Array<MenuConfigInterface>();
    this.privateMenuMaster.forEach((menu: MenuConfigInterface) => {
      menu.isActive = false;
      if (menu.headerMenu != undefined && menu.headerMenu.length > 0) {
        menu.headerMenu.forEach(headerMenu => {
          headerMenu.isActive = false;
          if (headerMenu.activeClass == this.activeClass) {
            headerMenu.isActive = true;
            menu.isActive = true;
          }
        });
        if (menu.isActive) {
          tempMenu = menu.headerMenu;
        }
      } else if (menu.activeClass == this.activeClass) {
        menu.isActive = true;
      }
    });
    return tempMenu;
  }
  prepareMenu(): Array<MenuConfigInterface> {
    var tempMenu = new Array<MenuConfigInterface>();
    this.privateMenuMaster.forEach((menu: MenuConfigInterface) => {
      if (menu.moduleId != undefined && menu.moduleId.length > 0) {
        let hasModuleAccess = false;
        menu.moduleId.forEach((moduleId: number | string) => {
          if (this.currentUser.moduleViews != undefined && this.currentUser.moduleViews.length > 0
            && CommonUtility.checkValueExistInArray(this.currentUser.moduleViews, "id", Number(moduleId))) {
            hasModuleAccess = true;
          }
        });
        if (hasModuleAccess) {
          tempMenu.push(menu);
        }
      } else {
        tempMenu.push(menu);
      }

      if (tempMenu.length > 0) {
        // Second Lavel Menu Module Check
        // tempMenu.forEach((menu: MenuConfig) => {
        //   var tempChildMenuArray = new Array<MenuConfig>();
        //   if (menu.childMenu != undefined && menu.childMenu.length > 0) {
        //     menu.childMenu.forEach((childMenu: MenuConfig) => {
        //       let hasModuleAccess = false;
        //       if (childMenu.moduleId != undefined && childMenu.moduleId.length > 0) {
        //         for (let index = 0; index < childMenu.moduleId.length; index++) {
        //           const moduleId = Number(childMenu.moduleId[index]);
        //           if (CommonUtility.checkValueExistInArray(this.currentUser.moduleViews, "id", moduleId)) {
        //             hasModuleAccess = true;
        //           }
        //         }
        //         if (hasModuleAccess) {
        //           tempChildMenuArray.push(childMenu);
        //         }
        //       } else {
        //         tempChildMenuArray.push(childMenu);
        //       }
        //     });
        //   }
        //   menu.childMenu = tempChildMenuArray;
        // });
        // Second Lavel Menu Module Check
        tempMenu.forEach((menu: MenuConfigInterface) => {
          var tempHeaderMenuArray = new Array<MenuConfigInterface>();
          if (menu.headerMenu != undefined && menu.headerMenu.length > 0) {
            menu.headerMenu.forEach((headerMenu: MenuConfigInterface) => {
              let hasModuleAccess = false;
              if (headerMenu.moduleId != undefined && headerMenu.moduleId.length > 0) {
                headerMenu.moduleId.forEach((moduleId: number | string) => {
                  if (this.currentUser.moduleViews != undefined && this.currentUser.moduleViews.length > 0
                    && CommonUtility.checkValueExistInArray(this.currentUser.moduleViews, "id", Number(moduleId))) {
                    hasModuleAccess = true;
                  }
                });
                if (hasModuleAccess) {
                  tempHeaderMenuArray.push(headerMenu);
                }
              } else {
                tempHeaderMenuArray.push(headerMenu);
              }
            });
          }
          menu.headerMenu = tempHeaderMenuArray;
        });
      }
      // tempMenu.push(menu);
    });
    return tempMenu;
  }
  openCloseSidebarFunction(isSidebarOpen: boolean) {
    this.isSidebarOpen = isSidebarOpen;
  }

}
