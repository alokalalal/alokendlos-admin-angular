import { UserView } from '../../../view/common/user-view';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { LocalStorageKey } from 'src/app/constants/local-storage-key';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import LocalStorageUtility from 'src/app/utility/localStorageUtility';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  @BlockUI('sectionBlockUI') sectionBlockUI!: NgBlockUI
  @BlockUI('resetPasswordBtnBlockUI') resetPasswordBtnBlockUI!: NgBlockUI

  resetPasswordForm: FormGroup;
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  hideNewPassword: boolean = false;
  hideConfirmPassword: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private currentUserStoreService : CurrentUserStoreService,
    private router: Router) {
    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    })
    if (this.route.snapshot.params.token != undefined) {
      this.sectionBlockUI.start();
      this.loginService.doResetPasswordVerificationToken(this.route.snapshot.params.token).subscribe(response => {
        if (response != undefined && response.code != undefined) {
          if (response.code >= 1000 && response.code < 2000) {
            this.snackBarService.successSnackBar(response.message)
            if (response.accessToken != undefined && response.accessToken != null) {
              let user : UserView = this.currentUserStoreService.getCurrentUser();
              user.accessToken = response.accessToken;
              this.currentUserStoreService.set(user);
            }
          } else {
            this.sharedService.clearSession();
            this.snackBarService.errorSnackBar(response.message)
            this.router.navigate([this.appUrl.USER + '/' + this.appUrl.LOGIN])
          }
        }
        this.sectionBlockUI.stop();
      }, error => {
        this.sectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error)
      })
    }
  }

  ngOnInit(): void {
  }

  onResetPasswordSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.resetPasswordBtnBlockUI.start();
    this.loginService.doResetPassword(this.resetPasswordForm.value).subscribe(response => {
      if (response != undefined && response.code != undefined) {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message)
          this.router.navigate([this.appUrl.USER + '/' + this.appUrl.LOGIN]);
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }
      this.resetPasswordBtnBlockUI.stop();
    }, error => {
      this.resetPasswordBtnBlockUI.stop();
      this.snackBarService.errorSnackBar(error)
    })
  }

  get f() { return this.resetPasswordForm.controls }

}
