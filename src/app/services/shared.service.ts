import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { AppUrl } from '../constants/app-url';
import { RightsConfig } from '../constants/rights-config';
import { CommonViewResponse } from '../responses/common-view-response';
import { IdNameView } from '../view/common/id-name-view';
import { AcceessRightsInterface } from './../Interface/acceess-rights';
import { UserView } from '../view/common/user-view';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public currentLoggedInUser: UserView = new UserView();
  public appUrl = AppUrl;
  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private currentUserStoreService: CurrentUserStoreService
  ) { }

  clearSession() {
    this.currentUserStoreService.delete();
  }

  doIsLogin() {
    return new Promise<boolean>((resolve, reject) => {
      this.http.get<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + '/private/user/is-loggedIn')
        .subscribe(res => {
          if (res != undefined && res.code != undefined) {
            if (res.code >= 1000 && res.code < 2000) {
              this.currentUserStoreService.set(res.view)
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }, err => {
          this.snackBarService.errorSnackBar(err);
        });
    })
  }

  doGetAccessToken() {
    let body = {};
    if (this.currentUserStoreService.getCurrentUser().accessToken && this.currentUserStoreService.getCurrentUser().refreshToken) {
      body = { "accessToken": this.currentUserStoreService.getCurrentUser().accessToken, "refreshToken": this.currentUserStoreService.getCurrentUser().refreshToken }
      this.http.post<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + "/private/user/get-access-token", body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          let user : UserView = this.currentUserStoreService.getCurrentUser();
          if (response.accessToken != undefined) {
            user.accessToken = response.accessToken;
          }
          if (response.refreshToken != undefined) {
            user.refreshToken = response.refreshToken;
          }
          this.currentUserStoreService.set(user);
          window.location.reload();
        }
      })
    }
  }

  getAccessRights(module: IdNameView): AcceessRightsInterface {
    let accessRightsJson: AcceessRightsInterface = {
      isAccessRightAdd: false,
      isAccessRightEdit: false,
      isAccessRightView: false,
      isAccessRightDelete: false,
      isAccessRightList: false,
      isAccessRightActivation: false
    }
    if (this.currentUserStoreService.getCurrentUser() != undefined && this.currentUserStoreService.getCurrentUser().id != undefined && this.currentUserStoreService.getCurrentUser().id != 0) {
      this.currentLoggedInUser = this.currentUserStoreService.getCurrentUser();

      if (this.currentLoggedInUser.moduleViews != undefined && this.currentLoggedInUser.moduleViews.length > 0) {
        this.currentLoggedInUser.moduleViews.forEach(function (moduleKey, moduleValue) {
          if (module.id == moduleKey.id) {
            moduleKey.rightsViews.forEach(function (rightKey, rightValue) {
              switch (rightKey.id) {
                case (RightsConfig.ADD.id): {
                  accessRightsJson.isAccessRightAdd = true;
                  break;
                }
                case (RightsConfig.UPDATE.id): {
                  accessRightsJson.isAccessRightEdit = true;
                  break;
                }
                case (RightsConfig.VIEW.id): {
                  accessRightsJson.isAccessRightView = true;
                  break;
                }
                case (RightsConfig.DELETE.id): {
                  accessRightsJson.isAccessRightDelete = true;
                  break;
                }
                case (RightsConfig.LIST.id): {
                  accessRightsJson.isAccessRightList = true;
                  break;
                }
                case (RightsConfig.ACTIVATION.id): {
                  accessRightsJson.isAccessRightActivation = true;
                  break;
                }
              }
            });
          }
        });
      }
    }
    return accessRightsJson
  }

}
