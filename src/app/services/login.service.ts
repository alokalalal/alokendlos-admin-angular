import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { AppUrl } from '../constants/app-url';
import { LocalStorageKey } from '../constants/local-storage-key';
import { UserView } from '../view/common/user-view';
import { CommonViewResponse } from '../responses/common-view-response';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};
@Injectable({
  providedIn: 'root'
})
export class LoginService implements Resolve<any>  {

  public appUrl = AppUrl;
  public localStorageKey = LocalStorageKey;

  @BlockUI() blockUI!: NgBlockUI;
  currentUser!: UserView;

  doLogin(user: UserView) {
    return this.http.post<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + "/public/user/login", user, httpOptions)
  }

  doLogout() {
    return this.http.get<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + "/private/user/logout", httpOptions)
  }

  doForgotPassword(user: UserView) {
    return this.http.post<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + "/public/user/send-reset-link", user, httpOptions)
  }

  doOtpVerification(user: UserView) {
    return this.http.post<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + "/private/user/activate-through-otp", user, httpOptions)
  }

  doResetPassword(user: UserView) {
    return this.http.post<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + "/private/user/reset-password", user, httpOptions)
  }

  doResetPasswordVerificationToken(token: String) {
    return this.http.get<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + "/public/user/reset-password-verification?resetPasswordVerification=" + token, httpOptions)
  }

  otpResendCode() {
    return this.http.get<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + '/private/user/resent-activation-otp')
  }
  isloggedIn() {
    if (this.currentUserStoreService.getCurrentUser() != undefined && this.currentUserStoreService.getCurrentUser().id != undefined && this.currentUserStoreService.getCurrentUser().id != 0) {
      this.blockUI.stop();
      this.currentUser = this.currentUserStoreService.getCurrentUser();
      this.router.navigateByUrl(this.appUrl.DASHBOARD);
    } else {
      this.blockUI.stop();
    }
  }

  doIsloggedIn() {
    return this.http.get<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + '/private/user/is-loggedIn', httpOptions);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.blockUI.start();

    if (state.url == "/" + this.appUrl.USER + "/" + this.appUrl.LOGIN
      || state.url == "/" + this.appUrl.USER + "/" + this.appUrl.FORGOT_PASSWORD
      || state.url == "/" + this.appUrl.USER + "/" + this.appUrl.OTP_VERIFICATION
      || state.url == "/" + this.appUrl.USER + "/" + this.appUrl.RESET_PASSWORD_VERIFICATION
      || state.url == "/" + this.appUrl.USER + "/" + this.appUrl.FIRST_TIME_CHANGE_PASSWORD
      || state.url == "/" + this.appUrl.USER + "/" + this.appUrl.CHANGE_PASSWORD) {
      this.isloggedIn();
      this.blockUI.stop();
    }
  };
  constructor(
    private router: Router,
    private http: HttpClient,
    private currentUserStoreService: CurrentUserStoreService
  ) { }
}