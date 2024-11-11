import { ResponseCode } from './../../../constants/response-code';
import { UserView } from '../../../view/common/user-view';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { AppUrl } from 'src/app/constants/app-url';
import { loginIdValidation } from 'src/app/constants/custom.validators';
import { ErrorMessage } from 'src/app/constants/error-message';
import { LocalStorageKey } from 'src/app/constants/local-storage-key';
import { LoginService } from 'src/app/services/login.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import LocalStorageUtility from 'src/app/utility/localStorageUtility';
import { CommonViewResponse } from 'src/app/responses/common-view-response';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @BlockUI('loginBtnBlockUI') loginBtnBlockUI!: NgBlockUI;
  public loginForm: FormGroup;
  public appUrl = AppUrl;
  errorMessage = ErrorMessage;
  hide: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private snackBarService: SnackBarService,
    private currentUserStoreService: CurrentUserStoreService,
  ) {
    this.loginForm = this.formBuilder.group({
      loginId: new FormControl('', [Validators.required, loginIdValidation, Validators.maxLength(100)]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    
    if (this.loginForm.invalid) {
      return;
    }
    this.loginBtnBlockUI.start();
    this.loginService.doLogin(this.loginForm.value).subscribe(response => {
      switch (response != undefined && response.code != undefined) {
        case (response.code >= 1000 && response.code < 2000) : {
          if (response.view != undefined 
            && response.accessToken != undefined && response.accessToken != null
            && response.refreshToken != undefined && response.refreshToken != null) {
            let tempUser : UserView = response.view;
            tempUser.accessToken = response.accessToken;
            tempUser.refreshToken = response.refreshToken;
            this.currentUserStoreService.set(tempUser);
          }
          this.router.navigate([this.appUrl.DASHBOARD]);
          break;
        } case (response.code == ResponseCode.TEMP_PASSWORD_SESSION && response.accessToken != undefined && response.accessToken != null) : {
          let tempUser : UserView = this.currentUserStoreService.getCurrentUser();
          tempUser.accessToken = response.accessToken;
          this.currentUserStoreService.set(tempUser);
          this.router.navigate([this.appUrl.USER + '/' + this.appUrl.FIRST_TIME_CHANGE_PASSWORD]);
          break;
        } case (response.code == ResponseCode.INACTIVE_USER) : {
          this.snackBarService.errorSnackBar(response.message);
          this.router.navigate(['/' + this.appUrl.USER + '/' + this.appUrl.OTP_VERIFICATION]);
          break;
        } case (response.accessToken != undefined && response.accessToken != null && 
          (response.code == ResponseCode.EMAIL_VERIFICATION || response.code == ResponseCode.VALIDATE_NEW_DEVICE)) : {
          this.snackBarService.errorSnackBar(response.message);
          this.setTempUserAccessTokenInStore(response);
          break;
        } default : {
          this.snackBarService.errorSnackBar(response.message);
        }
        this.loginBtnBlockUI.stop();
      }
      
    }, error => {
      this.loginBtnBlockUI.stop();
      this.snackBarService.errorSnackBar(error);
    })
  }
  setTempUserAccessTokenInStore(response: CommonViewResponse<UserView>) {
    let tempUser : UserView = this.currentUserStoreService.getCurrentUser();
    tempUser.accessToken = response.accessToken;
    this.currentUserStoreService.set(tempUser);
  }

}

