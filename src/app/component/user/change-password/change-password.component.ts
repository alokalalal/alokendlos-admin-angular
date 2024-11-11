import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
  changePassword: FormGroup;
  isOpenModel: boolean = true;
  hideOldPassword: boolean = false;
  hideNewPassword: boolean = false;
  hideConfirmPassword: boolean = false;
  isComponentDestroy: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private snackBarService: SnackBarService, private router: Router, private sharedService: SharedService) {
      this.changePassword = this.formBuilder.group({
        oldPassword: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required])
      })
  }

  ngOnInit(): void {
  }

  onChangePasswordSubmit(){
    if(this.changePassword.invalid){
      return;
    }

    const oldPasswordValue = this.changePassword.get('oldPassword')?.value;
    const confirmPasswordValue = this.changePassword.get('confirmPassword')?.value;

    if(oldPasswordValue === confirmPasswordValue) {
      this.snackBarService.errorSnackBar("The newly entered password must differ from the old password");
    }
    else {
      this.saveUpdateBtnBlockUI.start();
      this.userService.changePassword(this.changePassword.value).subscribe(response =>{
        if(response.code >= 1000 && response.code < 2000){
          this.snackBarService.successSnackBar(response.message)
          this.sharedService.clearSession();
          this.router.navigate([this.appUrl.USER + '/' + this.appUrl.LOGIN])
        }else{
          this.snackBarService.errorSnackBar(response.message)        
        }
        this.saveUpdateBtnBlockUI.stop();
      }, error=>{
        this.saveUpdateBtnBlockUI.stop();
        this.snackBarService.errorSnackBar(error)        
      })
    }
  }
  get f(){ return this.changePassword.controls }

  closeModal(){
    this.ngOnDestroy();
  }

  ngOnDestroy(){
    this.isOpenModel = false;
    this.isComponentDestroy = true
    this.dynamicComponentCloseEventEmitter.next(this.isComponentDestroy)
  }

}
