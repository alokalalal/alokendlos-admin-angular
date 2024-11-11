import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { AppUrl } from 'src/app/constants/app-url';
import { LoginService } from 'src/app/services/login.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {
  @BlockUI('resendOtpBtnBlockUI') resendOtpBtnBlockUI!: NgBlockUI
  @BlockUI('otpBtnBlockUI') otpBtnBlockUI!: NgBlockUI
  otp!: string;
  otpForm: FormGroup;
  appUrl = AppUrl;

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBarService: SnackBarService,
    private currentUserStoreService: CurrentUserStoreService
  ) {
    this.otpForm = this.formBuilder.group({
      verificaitionOtp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    });
  }

  ngOnInit(): void {
  }

  otpSubmit() {
    console.log(this.otpForm)
    if (this.otpForm.invalid) {
      return;
    }
    this.otpBtnBlockUI.start();
    this.loginService.doOtpVerification(this.otpForm.value).subscribe(response => {
      if (response != undefined && response.code != undefined) {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message)
          this.loginService.doIsloggedIn().subscribe(res => {
            if (res != undefined && res.code != undefined) {
              if (res.code >= 1000 && res.code < 2000) {
                this.currentUserStoreService.set(res.view);
                this.router.navigate([this.appUrl.DASHBOARD]);
              } else {
                this.snackBarService.errorSnackBar(response.message)
              }
            }
          }, error => {
            this.otpBtnBlockUI.stop();
            this.snackBarService.errorSnackBar(error)
          });
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.otpBtnBlockUI.stop();
      }
    }, error => {
      this.otpBtnBlockUI.stop();
      this.snackBarService.errorSnackBar(error)
    })
  }

  resendCode() {
    this.resendOtpBtnBlockUI.start();
    this.loginService.otpResendCode().subscribe(response => {
      if (response != undefined && response.code != undefined) {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message)
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.resendOtpBtnBlockUI.stop();
      }
    }, error => {
      this.resendOtpBtnBlockUI.stop();
      this.snackBarService.errorSnackBar(error)
    })
  }

  onOtpChange(otp: string) {
    this.otp = otp;
    this.otpForm.controls['verificaitionOtp'].setValue(this.otp);
  }

  get f() { return this.otpForm.controls }

}
