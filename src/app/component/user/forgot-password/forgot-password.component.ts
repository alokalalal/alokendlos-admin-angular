import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { loginIdValidation } from 'src/app/constants/custom.validators';
import { ErrorMessage } from 'src/app/constants/error-message';
import { LoginService } from 'src/app/services/login.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @BlockUI('forgotPasswordBtnBlockUI') forgotPasswordBtnBlockUI!: NgBlockUI
  forgotPasswordForm: FormGroup;
  appUrl = AppUrl;
  errorMessage = ErrorMessage;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private snackBarService: SnackBarService, private router: Router) {
    this.forgotPasswordForm = this.formBuilder.group({
      loginId: new FormControl('', [Validators.required, loginIdValidation, Validators.maxLength(100)])
    })
  }

  ngOnInit(): void {
  }

  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.forgotPasswordBtnBlockUI.start();
    this.loginService.doForgotPassword(this.forgotPasswordForm.value).subscribe(response => {
      if (response != undefined && response.code != undefined) {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message)
          this.router.navigate(['/' + this.appUrl.USER + '/' + this.appUrl.LOGIN]);
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }
      this.forgotPasswordBtnBlockUI.stop();
    }, error => {
      this.forgotPasswordBtnBlockUI.stop();
      this.snackBarService.errorSnackBar(error)
    })
  }

  get f() { return this.forgotPasswordForm.controls; }

}
